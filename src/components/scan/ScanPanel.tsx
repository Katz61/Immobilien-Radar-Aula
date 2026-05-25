import { useState, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { GEMEINDEN } from '../../data/gemeinden';
import { wgs84ToLV95, escapeHtml } from '../../utils/coordinates';
import { scanBuildings } from '../../services/geo-admin';
import { fetchZoneInfo, getMaxAZ } from '../../services/geodienste';
import { calculateScore } from '../../utils/scoring';
import { decodeGkat, decodeHeating } from '../../utils/decoders';
import type { Lead, BuildingResult } from '../../types';

export function ScanPanel() {
  const [gemeinde, setGemeinde] = useState('Zug');
  const [rasterSize, setRasterSize] = useState(100);
  const scanRunning = useStore((s) => s.scanRunning);
  const setScanRunning = useStore((s) => s.setScanRunning);
  const scanAbort = useStore((s) => s.scanAbort);
  const setScanAbort = useStore((s) => s.setScanAbort);
  const scanProgress = useStore((s) => s.scanProgress);
  const setScanProgress = useStore((s) => s.setScanProgress);
  const addLeads = useStore((s) => s.addLeads);
  const showToast = useStore((s) => s.showToast);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const setLastScanTimestamp = useStore((s) => s.setLastScanTimestamp);

  const startScan = useCallback(async () => {
    const info = GEMEINDEN[gemeinde];
    if (!info) return;

    setScanRunning(true);
    setScanAbort(false);
    setScanProgress({ done: 0, total: 0, found: 0, gemeinde });

    const [lonMin, latMin, lonMax, latMax] = info.bbox;
    const latStep = rasterSize / 111320;
    const lonStep = rasterSize / (111320 * Math.cos((info.lat * Math.PI) / 180));

    const points: Array<[number, number]> = [];
    for (let lat = latMin; lat <= latMax; lat += latStep) {
      for (let lon = lonMin; lon <= lonMax; lon += lonStep) {
        points.push([lat, lon]);
      }
    }

    setScanProgress({ total: points.length });

    const seenEGIDs = new Set<number>();
    const foundLeads: Lead[] = [];

    for (let i = 0; i < points.length; i++) {
      if (useStore.getState().scanAbort) break;

      const [lat, lon] = points[i];
      const [e, n] = wgs84ToLV95(lat, lon);

      try {
        const buildings: BuildingResult[] = await scanBuildings(e, n);

        for (const bld of buildings) {
          const bp = bld.properties;
          if (!bp.egid || seenEGIDs.has(bp.egid)) continue;
          if (bp.ggdename !== gemeinde) continue;
          seenEGIDs.add(bp.egid);

          let zoneInfo = null;
          try { zoneInfo = await fetchZoneInfo(lat, lon); } catch { /* ignore */ }
          const azInfo = getMaxAZ(zoneInfo);
          let azReserve: number | null = null;
          if (azInfo && bp.garea && bp.gastw) {
            const parcelArea = bp.garea * 4;
            const actualAZ = (bp.garea * bp.gastw) / parcelArea;
            azReserve = Math.round((azInfo.az - actualAZ) * 100) / 100;
          }

          const score = calculateScore(bp, azReserve, undefined);
          const addr = bp.strname_deinr || `${bp.strname || ''} ${bp.deinr || ''}`.trim();

          const lead: Lead = {
            id: Date.now() + Math.random(),
            egrid: bp.egrid || '\u2014',
            egid: bp.egid,
            parcelNr: bp.lparz || '\u2014',
            address: addr || '\u2014',
            plz: bp.dplz4 || '',
            ort: bp.dplzname || bp.ggdename || '\u2014',
            gemeinde: bp.ggdename || '\u2014',
            baujahr: bp.gbauj || null,
            flaeche: bp.garea || null,
            geschosse: bp.gastw || null,
            wohnungen: bp.ganzwhg || null,
            kategorie: decodeGkat(bp.gkat),
            heizung: decodeHeating(bp.gwaerzh1),
            bezeichnung: bp.gbez || '\u2014',
            zonentyp: zoneInfo?.zonentyp || '',
            azMax: azInfo?.az ?? null,
            azActual: azReserve != null && azInfo ? azInfo.az - azReserve : null,
            azReserve,
            ownerType: '',
            ownerHints: '',
            companies: '',
            solarKlasse: '',
            solarStrom: '',
            lat, lon,
            buildings: 1,
            score,
            status: 'neu',
            notes: '',
            savedAt: new Date().toISOString(),
          };

          foundLeads.push(lead);

          window.dispatchEvent(new CustomEvent('map:addMarker', {
            detail: {
              lat, lon, score, address: addr,
              popup: `<b>${escapeHtml(addr)}</b><br>Score: ${score}<br>Bj. ${bp.gbauj || '\u2014'}`,
            },
          }));
        }
      } catch { /* ignore individual scan errors */ }

      setScanProgress({ done: i + 1, found: seenEGIDs.size });

      if (i % 10 === 0) await new Promise((r) => setTimeout(r, 50));
    }

    const addedCount = addLeads(foundLeads);
    setLastScanTimestamp(new Date().toISOString());
    setScanRunning(false);
    showToast(`Scan abgeschlossen: ${seenEGIDs.size} Gebäude gefunden, ${addedCount} neue Leads gespeichert.`);
    setActiveTab('leads');
  }, [gemeinde, rasterSize, setScanRunning, setScanAbort, setScanProgress, addLeads, showToast, setActiveTab, setLastScanTimestamp]);

  const handleAbort = () => {
    setScanAbort(true);
    showToast('Scan wird abgebrochen...');
  };

  const pct = scanProgress.total > 0 ? Math.round((scanProgress.done / scanProgress.total) * 100) : 0;

  return (
    <div className="p-4">
      <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-4">
        GEBIET-SCAN — Gemeinde durchsuchen
      </div>

      <div className="mb-4">
        <label className="block font-mono text-[10px] text-text2 mb-1">Gemeinde</label>
        <select
          value={gemeinde}
          onChange={(e) => setGemeinde(e.target.value)}
          disabled={scanRunning}
          className="select-sm w-full"
        >
          {Object.keys(GEMEINDEN).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-mono text-[10px] text-text2 mb-1">
          Raster-Genauigkeit: {rasterSize} m
        </label>
        <input
          type="range"
          min={50}
          max={300}
          step={25}
          value={rasterSize}
          onChange={(e) => setRasterSize(parseInt(e.target.value))}
          disabled={scanRunning}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-[9px] text-muted font-mono mt-0.5">
          <span>50m (langsam)</span>
          <span>300m (schnell)</span>
        </div>
      </div>

      {!scanRunning ? (
        <button onClick={startScan} className="btn-primary w-full">
          GEBIET SCANNEN
        </button>
      ) : (
        <div>
          <div className="mb-2">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text2">{scanProgress.gemeinde}</span>
              <span className="text-accent font-mono">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
              <span>{scanProgress.done}/{scanProgress.total} Punkte</span>
              <span>{scanProgress.found} Gebäude</span>
            </div>
          </div>
          <button
            onClick={handleAbort}
            disabled={scanAbort}
            className="btn-danger w-full"
          >
            {scanAbort ? 'WIRD ABGEBROCHEN...' : 'SCAN ABBRECHEN'}
          </button>
        </div>
      )}

      <div className="mt-6 text-[10px] text-muted space-y-1">
        <div>Der Scan durchsucht die gewählte Gemeinde mit einem Raster.</div>
        <div>Kleineres Raster = mehr Abfragen = längere Dauer, aber vollständigere Ergebnisse.</div>
        <div>Gefundene Gebäude werden automatisch als Leads gespeichert und auf der Karte markiert.</div>
      </div>
    </div>
  );
}

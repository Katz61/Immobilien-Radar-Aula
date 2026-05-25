import { useStore } from '../../store/useStore';
import { DetailRow } from './DetailRow';
import { AZSection } from './AZSection';
import { OwnerSection } from './OwnerSection';
import { SolarSection } from './SolarSection';
import { RenditeSection } from './RenditeSection';
import { LinksSection } from './LinksSection';
import { decodeGkat, decodeGklas, decodeHeating, decodeEnergy } from '../../utils/decoders';
import { calculateScore } from '../../utils/scoring';
import { getMaxAZ } from '../../services/geodienste';
import { calculatePolygonArea } from '../../utils/coordinates';
import type { Lead } from '../../types';

export function DetailsPanel() {
  const currentFeature = useStore((s) => s.currentFeature);
  const isLoading = useStore((s) => s.isLoading);
  const addLead = useStore((s) => s.addLead);
  const showToast = useStore((s) => s.showToast);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-muted gap-3">
        <div className="w-3.5 h-3.5 border-2 border-border border-t-accent rounded-full animate-spin" />
        <div className="text-[13px]">Lade Daten von geo.admin.ch...</div>
      </div>
    );
  }

  if (!currentFeature) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-muted gap-3">
        <div className="text-[40px] opacity-30">🏠</div>
        <div className="text-[13px] leading-relaxed">
          Klicke auf die Karte oder suche eine Adresse,<br />um Liegenschaftsdaten abzurufen.
        </div>
      </div>
    );
  }

  const { parcel, buildings, lat, lon, e, n, zoneInfo, solarData, ownerInfo } = currentFeature;
  const p = parcel?.properties || {};
  const b0 = buildings[0]?.properties;
  const azInfo = getMaxAZ(zoneInfo);

  const handleSaveAsLead = () => {
    if (!b0) return;

    const azMax = azInfo?.az ?? null;
    let azActual: number | null = null;
    let azReserve: number | null = null;

    if (azInfo && b0.garea && b0.gastw) {
      let parcelArea: number | null = null;
      if (parcel?.geometry) {
        try {
          const geom = parcel.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
          const coords = geom.type === 'MultiPolygon'
            ? (geom.coordinates as number[][][][])[0][0]
            : geom.type === 'Polygon'
              ? (geom.coordinates as number[][][])[0]
              : null;
          if (coords && coords.length >= 3) {
            parcelArea = calculatePolygonArea(coords);
          }
        } catch { /* ignore */ }
      }
      if (!parcelArea) parcelArea = b0.garea * 4;

      const parcelEgrid = p.egris_egrid as string;
      const parcelBuildings = parcelEgrid
        ? buildings.filter((b) => b.properties.egrid === parcelEgrid)
        : [buildings[0]];
      const relevantBuildings = parcelBuildings.length > 0 ? parcelBuildings : [buildings[0]];
      const totalGF = relevantBuildings.reduce(
        (sum, bld) => sum + (bld.properties.garea || 0) * (bld.properties.gastw || 1), 0,
      );
      azActual = Math.round((totalGF / parcelArea) * 100) / 100;
      azReserve = Math.round((azInfo.az - azActual) * 100) / 100;
    }

    const lead: Lead = {
      id: Date.now(),
      egrid: (p.egris_egrid as string) || b0.egrid || '\u2014',
      egid: b0.egid || null,
      parcelNr: (p.number as string) || b0.lparz || '\u2014',
      address: b0.strname_deinr || `${b0.strname || ''} ${b0.deinr || ''}`.trim() || '\u2014',
      plz: b0.dplz4 || '',
      ort: b0.dplzname || b0.ggdename || '\u2014',
      gemeinde: b0.ggdename || '\u2014',
      baujahr: b0.gbauj || null,
      flaeche: b0.garea || null,
      geschosse: b0.gastw || null,
      wohnungen: b0.ganzwhg || null,
      kategorie: decodeGkat(b0.gkat),
      heizung: decodeHeating(b0.gwaerzh1),
      bezeichnung: b0.gbez || '\u2014',
      zonentyp: zoneInfo?.zonentyp || '',
      azMax: azMax,
      azActual: azActual,
      azReserve: azReserve,
      ownerType: ownerInfo?.type || '',
      ownerHints: (ownerInfo?.hints || []).join('; '),
      companies: (ownerInfo?.companies || []).map((c) => c.name).join(', '),
      solarKlasse: solarData?.klasseText || '',
      solarStrom: solarData?.stromertrag || '',
      lat, lon,
      buildings: buildings.length,
      score: calculateScore(b0, azReserve, ownerInfo?.type),
      status: 'neu',
      notes: '',
      savedAt: new Date().toISOString(),
    };

    const added = addLead(lead);
    showToast(added ? `Lead gespeichert: ${lead.address}` : 'Lead bereits gespeichert.');
  };

  const handlePDFReport = () => {
    if (!b0) return;
    const addr = b0.strname_deinr || `${b0.strname || ''} ${b0.deinr || ''}`.trim() || '\u2014';
    const date = new Date().toLocaleDateString('de-CH');
    const score = calculateScore(b0, null, ownerInfo?.type);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>K AG Report — ${addr}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  h2 { font-size: 14px; color: #666; font-weight: 400; margin-bottom: 24px; }
  h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #888; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 20px 0 10px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #1a1a1a; padding-bottom: 16px; }
  .logo { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
  .meta { text-align: right; font-size: 11px; color: #666; }
  .score-box { display: inline-block; padding: 8px 16px; font-size: 28px; font-weight: 700; border-radius: 4px; margin: 10px 0; }
  .score-high { background: #e8f5e9; color: #2e7d32; }
  .score-med { background: #fff8e1; color: #f57f17; }
  .score-low { background: #fafafa; color: #888; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  td { padding: 5px 8px; font-size: 12px; border-bottom: 1px solid #eee; }
  td:first-child { font-weight: 600; color: #555; width: 180px; }
  .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media print { body { padding: 20px; } }
</style></head><body>
<div class="header">
  <div><div class="logo">K AG</div><div style="font-size:11px;color:#666;letter-spacing:2px">LEADMASCHINE</div></div>
  <div class="meta">Parzellen-Report<br>${date}<br>Vertraulich</div>
</div>
<h1>${addr}</h1>
<h2>${b0.dplz4 || ''} ${b0.dplzname || b0.ggdename || ''} — Parzelle ${(p.number as string) || b0.lparz || '\u2014'}</h2>
<div style="text-align:center">
  <div class="score-box ${score >= 60 ? 'score-high' : score >= 35 ? 'score-med' : 'score-low'}">Score: ${score}</div>
</div>
<div class="two-col"><div>
<h3>Parzelle</h3>
<table>
  <tr><td>EGRID</td><td>${(p.egris_egrid as string) || b0.egrid || '\u2014'}</td></tr>
  <tr><td>Gemeinde</td><td>${b0.ggdename || '\u2014'}</td></tr>
  <tr><td>Koordinaten</td><td>${lat.toFixed(5)}, ${lon.toFixed(5)}</td></tr>
</table></div><div>
<h3>Gebäude</h3>
<table>
  <tr><td>Baujahr</td><td>${b0.gbauj || '\u2014'}</td></tr>
  <tr><td>Fläche</td><td>${b0.garea ? b0.garea + ' m²' : '\u2014'}</td></tr>
  <tr><td>Geschosse</td><td>${b0.gastw || '\u2014'}</td></tr>
  <tr><td>Wohnungen</td><td>${b0.ganzwhg || '\u2014'}</td></tr>
  <tr><td>Kategorie</td><td>${decodeGkat(b0.gkat)}</td></tr>
  <tr><td>Heizung</td><td>${decodeHeating(b0.gwaerzh1)}</td></tr>
</table></div></div>
<div class="footer">K AG Leadmaschine — Generiert am ${date} — Alle Daten aus öffentlichen Quellen (geo.admin.ch, GWR, Zefix, sonnendach.ch)</div>
</body></html>`;

    const w = window.open('', '_blank');
    if (!w) { showToast('Popup blockiert — bitte Popup-Blocker deaktivieren.'); return; }
    w.document.write(html);
    w.document.close();
    showToast('PDF-Report geöffnet — Drucken für PDF (Ctrl+P)');
  };

  return (
    <div>
      {parcel && (
        <div className="p-4 border-b border-border">
          <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
            PARZELLE — Amtliche Vermessung
          </div>
          <DetailRow label="EGRID" value={(p.egris_egrid as string) || '\u2014'} />
          <DetailRow label="Parzelle Nr." value={(p.number as string) || '\u2014'} />
          <DetailRow label="Kanton" value={(p.ak as string) || '\u2014'} />
          <DetailRow label="LV95 E" value={Math.round(e)} />
          <DetailRow label="LV95 N" value={Math.round(n)} />
          <DetailRow label="WGS84" value={`${lat.toFixed(5)}, ${lon.toFixed(5)}`} />
          {p.egris_egrid && (
            <div className="mt-2">
              <a
                href={`https://zugmap.ch/bmcl/?egrid=${p.egris_egrid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-accent2 border-b border-accent2/30 hover:text-accent2/80 no-underline"
              >
                &rarr; ZugMap öffnen
              </a>
            </div>
          )}
        </div>
      )}

      {buildings.map((bld, i) => {
        const bp = bld.properties;
        const addr = bp.strname_deinr || `${bp.strname || ''} ${bp.deinr || ''}`.trim();
        return (
          <div key={bp.egid || i} className="p-4 border-b border-border">
            <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
              GEBÄUDE {buildings.length > 1 ? `${i + 1}/${buildings.length} ` : ''}— GWR
            </div>
            <DetailRow label="Adresse" value={addr || '\u2014'} />
            <DetailRow label="EGID" value={bp.egid || '\u2014'} />
            <DetailRow label="PLZ / Ort" value={`${bp.dplz4 || ''} ${bp.dplzname || ''}`} />
            <DetailRow label="Gemeinde" value={bp.ggdename || '\u2014'} />
            <DetailRow label="Bezeichnung" value={bp.gbez || '\u2014'} />
            <DetailRow
              label="Baujahr"
              value={
                bp.gbauj ? (
                  <span className={bp.gbauj < 1980 ? 'text-yellow' : ''}>{bp.gbauj}</span>
                ) : '\u2014'
              }
            />
            <DetailRow label="Gebäudefläche" value={bp.garea ? `${bp.garea} m²` : '\u2014'} />
            <DetailRow label="Geschosse" value={bp.gastw || '\u2014'} />
            <DetailRow label="Wohnungen" value={bp.ganzwhg || '\u2014'} />
            <DetailRow label="Kategorie" value={decodeGkat(bp.gkat)} />
            <DetailRow label="Klasse" value={decodeGklas(bp.gklas)} />
            <DetailRow label="Heizung" value={decodeHeating(bp.gwaerzh1)} />
            <DetailRow label="Energieträger" value={decodeEnergy(bp.genh1)} />
          </div>
        );
      })}

      <AZSection feature={currentFeature} azInfo={azInfo} />
      <OwnerSection ownerInfo={ownerInfo} />
      {solarData && <SolarSection data={solarData} />}
      <RenditeSection feature={currentFeature} azInfo={azInfo} />
      <LinksSection feature={currentFeature} />

      <div className="flex gap-2 flex-wrap p-4">
        <button onClick={handleSaveAsLead} className="btn-primary">
          + ALS LEAD SPEICHERN
        </button>
        <button onClick={handlePDFReport} className="btn-secondary">
          PDF REPORT
        </button>
      </div>
    </div>
  );
}

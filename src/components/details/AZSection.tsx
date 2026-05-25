import type { IdentifiedFeature } from '../../types';
import { DetailRow } from './DetailRow';
import { calculatePolygonArea } from '../../utils/coordinates';

interface AZSectionProps {
  feature: IdentifiedFeature;
  azInfo: { az: number; geschosse: number | null; zone: string } | null;
}

export function AZSection({ feature, azInfo }: AZSectionProps) {
  const { parcel, buildings, zoneInfo } = feature;

  if (!zoneInfo && !azInfo) return null;

  const b0 = buildings[0]?.properties;

  let parcelArea: number | null = null;
  let parcelAreaSource = '';
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
        parcelAreaSource = 'aus Geometrie';
      }
    } catch { /* ignore */ }
  }
  if (!parcelArea && b0?.garea) {
    parcelArea = b0.garea * 4;
    parcelAreaSource = 'geschätzt';
  }

  const p = parcel?.properties || {};
  const parcelEgrid = p.egris_egrid as string;
  const parcelBuildings = parcelEgrid
    ? buildings.filter((b) => b.properties.egrid === parcelEgrid)
    : buildings.length > 0 ? [buildings[0]] : [];
  const relevantBuildings = parcelBuildings.length > 0 ? parcelBuildings : buildings.length > 0 ? [buildings[0]] : [];

  const totalGF = relevantBuildings.reduce(
    (sum, bld) => sum + (bld.properties.garea || 0) * (bld.properties.gastw || 1), 0,
  );

  let actualAZ: number | null = null;
  let reserve: number | null = null;
  let reservePct: number | null = null;

  if (azInfo && parcelArea && parcelArea > 0) {
    actualAZ = Math.round((totalGF / parcelArea) * 100) / 100;
    reserve = Math.round((azInfo.az - actualAZ) * 100) / 100;
    reservePct = Math.round((reserve / azInfo.az) * 100);
  }

  const reserveColor = reserve != null
    ? reserve > 0.2 ? 'text-accent' : reserve > 0 ? 'text-yellow' : 'text-red'
    : '';

  return (
    <div className="p-4 border-b border-border">
      <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
        AUSNÜTZUNGSZIFFER — Zonenplan
      </div>
      <DetailRow label="Zonentyp" value={zoneInfo?.zonentyp || '\u2014'} />
      {zoneInfo?.kommunal && <DetailRow label="Kommunal" value={zoneInfo.kommunal} />}
      <DetailRow label="Hauptnutzung" value={zoneInfo?.hauptnutzung || '\u2014'} />

      {azInfo && (
        <>
          <DetailRow label="Max. AZ (erlaubt)" value={<span className="text-accent">{azInfo.az.toFixed(2)}</span>} />
          {azInfo.geschosse && <DetailRow label="Max. Geschosse" value={azInfo.geschosse} />}

          {parcelArea && (
            <DetailRow label="Grundstücksfläche" value={`~ ${parcelArea} m² (${parcelAreaSource})`} />
          )}

          {actualAZ != null && (
            <>
              <DetailRow label="Geschossfläche" value={`${totalGF} m²`} />
              <DetailRow label="Aktuelle AZ" value={<span className="text-yellow">{actualAZ.toFixed(2)}</span>} />
              <DetailRow
                label="AZ-Reserve"
                value={
                  <span className={`font-bold ${reserveColor}`}>
                    {reserve! >= 0 ? '+' : ''}{reserve!.toFixed(2)} ({reservePct}% {reserve! >= 0 ? 'frei' : 'übernutzt'})
                  </span>
                }
              />
              {reserve != null && reserve > 0.1 && parcelArea && (
                <div className="mt-2 mx-0 p-2 bg-accent/8 border border-accent/20 rounded-sm text-[12px] text-accent">
                  Entwicklungspotenzial: ca. {Math.round(reserve * parcelArea)} m² zusätzliche Geschossfläche möglich
                </div>
              )}
            </>
          )}
        </>
      )}

      {!azInfo && (
        <div className="text-[12px] text-text2 mt-2">
          Keine AZ-Daten für diese Zone verfügbar
        </div>
      )}
    </div>
  );
}

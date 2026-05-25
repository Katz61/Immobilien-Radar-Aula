import type { IdentifiedFeature } from '../../types';
import { RENDITE_PARAMS, BODENPREISE, REALADVISOR_PREISE, COMPARIS_PREISE } from '../../data/marktdaten';
import { calculatePolygonArea } from '../../utils/coordinates';

interface RenditeSectionProps {
  feature: IdentifiedFeature;
  azInfo: { az: number; geschosse: number | null; zone: string } | null;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString('de-CH');
}

function renditeColor(r: number): string {
  if (r >= 5) return 'text-accent';
  if (r >= 3) return 'text-yellow';
  return 'text-red';
}

export function RenditeSection({ feature, azInfo }: RenditeSectionProps) {
  const { parcel, buildings, zoneInfo } = feature;
  const b0 = buildings[0]?.properties;

  if (!azInfo || !b0 || buildings.length === 0) return null;

  const gemeindeName = feature.gemeinde || '';
  const zonenKey = zoneInfo?.zonentyp || '';
  const bodenBasis = BODENPREISE.preise[gemeindeName] || BODENPREISE.preise['default'];
  const zonenFaktor = RENDITE_PARAMS.landwert[zonenKey] || RENDITE_PARAMS.landwert['default'];
  const landwertM2 = Math.round(bodenBasis * zonenFaktor);
  const bodenUrl = BODENPREISE.urls[gemeindeName] || BODENPREISE.urls['default'];

  const raVerkauf = REALADVISOR_PREISE.verkauf[gemeindeName] || REALADVISOR_PREISE.verkauf['default'];
  const raMiete = REALADVISOR_PREISE.miete[gemeindeName] || REALADVISOR_PREISE.miete['default'];
  const cpVerkauf = COMPARIS_PREISE.verkauf[gemeindeName] || COMPARIS_PREISE.verkauf['default'];
  const cpUrl = COMPARIS_PREISE.urls[gemeindeName] || COMPARIS_PREISE.urls['default'];
  const mieteM2 = RENDITE_PARAMS.miete[zonenKey] || raMiete || RENDITE_PARAMS.miete['default'];

  let rkParcelArea: number | null = null;
  if (parcel?.geometry) {
    try {
      const geom = parcel.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      const coords = geom.type === 'MultiPolygon'
        ? (geom.coordinates as number[][][][])[0][0]
        : geom.type === 'Polygon'
          ? (geom.coordinates as number[][][])[0]
          : null;
      if (coords && coords.length >= 3) {
        rkParcelArea = calculatePolygonArea(coords);
      }
    } catch { /* ignore */ }
  }
  if (!rkParcelArea && b0.garea) rkParcelArea = b0.garea * 4;
  if (!rkParcelArea) return null;

  const aktuelleGF = (b0.garea || 0) * (b0.gastw || 1);
  const maxGF = Math.round(azInfo.az * rkParcelArea);
  const zusatzGF = Math.max(0, maxGF - aktuelleGF);
  const landwert = rkParcelArea * landwertM2;

  // Scenario 1: Sanierung
  const san_invest = aktuelleGF * RENDITE_PARAMS.baukosten.sanierung;
  const san_netto = aktuelleGF * mieteM2 * (1 - RENDITE_PARAMS.betriebskosten_pct);
  const san_rendite = san_invest > 0 ? Math.round((san_netto / san_invest) * 1000) / 10 : 0;
  const san_verkauf = aktuelleGF * raVerkauf;
  const san_roi = san_invest > 0 ? Math.round(((san_verkauf - san_invest) / san_invest) * 100) : 0;

  // Scenario 2: Aufstockung
  const auf_invest = zusatzGF * RENDITE_PARAMS.baukosten.aufstockung;
  const auf_netto = zusatzGF * mieteM2 * (1 - RENDITE_PARAMS.betriebskosten_pct);
  const auf_rendite = auf_invest > 0 ? Math.round((auf_netto / auf_invest) * 1000) / 10 : 0;
  const auf_verkauf = zusatzGF * raVerkauf;
  const auf_roi = auf_invest > 0 ? Math.round(((auf_verkauf - auf_invest) / auf_invest) * 100) : 0;

  // Scenario 3: Neubau
  const neu_invest = landwert + maxGF * RENDITE_PARAMS.baukosten.neubau + aktuelleGF * RENDITE_PARAMS.abbruchkosten_m2;
  const neu_netto = maxGF * mieteM2 * (1 - RENDITE_PARAMS.betriebskosten_pct);
  const neu_rendite = neu_invest > 0 ? Math.round((neu_netto / neu_invest) * 1000) / 10 : 0;
  const neu_verkauf = maxGF * raVerkauf;
  const neu_roi = neu_invest > 0 ? Math.round(((neu_verkauf - neu_invest) / neu_invest) * 100) : 0;

  return (
    <div className="p-4 border-b border-border">
      <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
        RENDITEKALKULATOR — 3 Szenarien
      </div>

      <div className="text-[10px] text-text2 mb-2 space-y-0.5">
        <div>Grundstück: ~{rkParcelArea} m² | Aktuelle GF: {aktuelleGF} m² | Max. GF: {maxGF} m² | Reserve: {zusatzGF} m²</div>
        <div>Landwert: CHF {fmt(landwertM2)}/m² | Miete: CHF {mieteM2}/m²/Jahr</div>
        <div className="text-muted">
          Marktpreise: RealAdvisor CHF {fmt(raVerkauf)}/m² · Comparis CHF {fmt(cpVerkauf)}/m²
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        {/* Sanierung */}
        <div className="bg-surface2 border border-border rounded-sm p-3 text-center">
          <div className="font-mono text-[10px] text-muted tracking-[1px] mb-2">SANIERUNG</div>
          <div className="text-[10px] text-text2">Investition</div>
          <div className="text-[13px] text-text font-semibold">CHF {fmt(san_invest)}</div>
          <div className="text-[10px] text-text2 mt-1">Nettomiete/Jahr</div>
          <div className="text-[12px] text-text">CHF {fmt(san_netto)}</div>
          <div className="text-[10px] text-text2 mt-1">Nettorendite</div>
          <div className={`text-[16px] font-bold ${renditeColor(san_rendite)}`}>{san_rendite}%</div>
          <div className="text-[9px] text-text2 mt-1">ROI Verkauf: {san_roi}%</div>
        </div>

        {/* Aufstockung */}
        <div className="bg-surface2 border border-border rounded-sm p-3 text-center">
          <div className="font-mono text-[10px] text-muted tracking-[1px] mb-2">AUFSTOCKUNG</div>
          <div className="text-[10px] text-text2">Investition</div>
          <div className="text-[13px] text-text font-semibold">CHF {fmt(auf_invest)}</div>
          <div className="text-[10px] text-text2 mt-1">Nettomiete/Jahr</div>
          <div className="text-[12px] text-text">CHF {fmt(auf_netto)}</div>
          <div className="text-[10px] text-text2 mt-1">Nettorendite</div>
          <div className={`text-[16px] font-bold ${renditeColor(auf_rendite)}`}>{auf_rendite}%</div>
          <div className="text-[9px] text-text2 mt-1">ROI Verkauf: {auf_roi}%</div>
        </div>

        {/* Neubau */}
        <div className="bg-surface2 border border-border rounded-sm p-3 text-center">
          <div className="font-mono text-[10px] text-muted tracking-[1px] mb-2">NEUBAU</div>
          <div className="text-[10px] text-text2">Investition</div>
          <div className="text-[13px] text-text font-semibold">CHF {fmt(neu_invest)}</div>
          <div className="text-[10px] text-text2 mt-1">Nettomiete/Jahr</div>
          <div className="text-[12px] text-text">CHF {fmt(neu_netto)}</div>
          <div className="text-[10px] text-text2 mt-1">Nettorendite</div>
          <div className={`text-[16px] font-bold ${renditeColor(neu_rendite)}`}>{neu_rendite}%</div>
          <div className="text-[9px] text-text2 mt-1">ROI Verkauf: {neu_roi}%</div>
        </div>
      </div>

      <div className="text-[9px] text-muted mt-2 space-x-2">
        Richtwerte — keine Anlageberatung. Quellen:{' '}
        <a href="https://realadvisor.ch/de/immobilienpreise-pro-m2/kanton-zug" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">RealAdvisor</a>{' · '}
        <a href={cpUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Comparis</a>{' · '}
        <a href={bodenUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">immobilienindex.ch</a>{' · BKP 2024/25'}
      </div>
    </div>
  );
}

import type { ZoneInfo } from '../types';
import { AZ_LOOKUP, ZONE_CODE_MAP } from '../data/az-lookup';

interface GeodienstFeature {
  properties: {
    typ_kantonal_bezeichnung?: string;
    typ_kantonal_code?: number;
    typ_kommunal_bezeichnung?: string;
    hauptnutzung_bezeichnung?: string;
    hauptnutzung_code?: number;
    kanton?: string;
  };
}

interface GeodienstResponse {
  features: GeodienstFeature[];
}

export async function fetchZoneInfo(lat: number, lon: number): Promise<ZoneInfo | null> {
  try {
    const d = 0.0003;
    const bbox = `${lon - d},${lat - d},${lon + d},${lat + d}`;
    const url = `https://geodienste.ch/db/npl_nutzungsplanung_v1_2_0/deu/ogcapi/collections/grundnutzung/items?f=json&limit=3&bbox=${bbox}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data: GeodienstResponse = await resp.json();
    if (!data.features || data.features.length === 0) return null;

    const validFeatures = data.features.filter((f) => {
      const code = f.properties?.hauptnutzung_code;
      return code && code >= 11 && code <= 16;
    });
    const feat = validFeatures.length > 0 ? validFeatures[0] : data.features[0];
    const p = feat.properties;

    return {
      zonentyp: p.typ_kantonal_bezeichnung || p.hauptnutzung_bezeichnung || '\u2014',
      zonencode: p.typ_kantonal_code ?? null,
      kommunal: p.typ_kommunal_bezeichnung || '',
      hauptnutzung: p.hauptnutzung_bezeichnung || '',
      kanton: p.kanton || '',
    };
  } catch (e) {
    console.warn('Zone lookup failed:', e);
    return null;
  }
}

export function getMaxAZ(zoneInfo: ZoneInfo | null): { az: number; geschosse: number | null; zone: string } | null {
  if (!zoneInfo) return null;

  if (zoneInfo.zonencode && ZONE_CODE_MAP[zoneInfo.zonencode] !== undefined) {
    const key = ZONE_CODE_MAP[zoneInfo.zonencode];
    if (key && AZ_LOOKUP[key]) return { ...AZ_LOOKUP[key], zone: key };
    if (key === null) return null;
  }

  const name = zoneInfo.zonentyp;
  if (AZ_LOOKUP[name]) return { ...AZ_LOOKUP[name], zone: name };

  for (const [key, val] of Object.entries(AZ_LOOKUP)) {
    if (name.includes(key) || key.includes(name)) return { ...val, zone: key };
  }

  const haupt = zoneInfo.hauptnutzung?.toLowerCase() || '';
  if (haupt.includes('wohnzone')) return { ...AZ_LOOKUP['Wohnzone'], zone: 'Wohnzone (geschätzt)' };
  if (haupt.includes('mischzone')) return { ...AZ_LOOKUP['Mischzone'], zone: 'Mischzone (geschätzt)' };
  if (haupt.includes('kernzone') || haupt.includes('zentrum')) return { ...AZ_LOOKUP['Kernzone'], zone: 'Kernzone (geschätzt)' };
  if (haupt.includes('arbeit')) return { ...AZ_LOOKUP['Arbeitszone'], zone: 'Arbeitszone (geschätzt)' };

  return null;
}

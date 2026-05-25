import type { SolarData } from '../types';

interface SolarResponse {
  results: Array<{
    attributes: {
      klasse: number;
      stromertrag: number;
      flaeche: number;
      neigung: number;
      mstrahlung: number;
      finanzertrag: number;
    };
  }>;
}

const KLASSE_TEXT: Record<number, string> = {
  5: 'Hervorragend',
  4: 'Sehr gut',
  3: 'Gut',
  2: 'Mittel',
  1: 'Gering',
};

export async function fetchSolarData(e: number, n: number): Promise<SolarData | null> {
  try {
    const url = `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&returnGeometry=false&layers=all:ch.bfe.solarenergie-eignung-daecher&geometry=${e},${n}&tolerance=50&mapExtent=${e - 200},${n - 200},${e + 200},${n + 200}&imageDisplay=400,400,96&sr=2056&lang=de&limit=3`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) return null;

    const data: SolarResponse = await resp.json();
    if (!data.results || data.results.length === 0) return null;

    const roofs = data.results.map((r) => r.attributes).filter((a) => a.klasse);
    if (roofs.length === 0) return null;

    const best = roofs.reduce((a, b) => (a.klasse >= b.klasse ? a : b));
    return {
      klasse: best.klasse,
      klasseText: KLASSE_TEXT[best.klasse] || `Klasse ${best.klasse}`,
      stromertrag: best.stromertrag || 0,
      flaeche: Math.round(best.flaeche || 0),
      neigung: best.neigung || 0,
      mstrahlung: best.mstrahlung || 0,
      finanzertrag: best.finanzertrag || 0,
    };
  } catch (e) {
    console.warn('Solar lookup failed:', e);
    return null;
  }
}

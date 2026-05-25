/** Convert WGS84 (lat/lon) to Swiss LV95 (E/N) */
export function wgs84ToLV95(lat: number, lon: number): [number, number] {
  const phi = (lat * 3600 - 169028.66) / 10000;
  const lam = (lon * 3600 - 26782.5) / 10000;
  const E = 2600072.37
    + 211455.93 * lam
    - 10938.51 * lam * phi
    - 0.36 * lam * phi * phi
    - 44.54 * lam * lam * lam;
  const N = 1200147.07
    + 308807.95 * phi
    + 3745.25 * lam * lam
    + 76.63 * phi * phi
    - 194.56 * lam * lam * phi
    + 119.79 * phi * phi * phi;
  return [Math.round(E * 100) / 100, Math.round(N * 100) / 100];
}

/** Calculate polygon area using the shoelace formula (for LV95 coords in meters) */
export function calculatePolygonArea(coords: number[][]): number {
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    area += coords[i][0] * coords[j][1];
    area -= coords[j][0] * coords[i][1];
  }
  return Math.round(Math.abs(area) / 2);
}

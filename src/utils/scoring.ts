import type { BuildingProperties } from '../types';

export function calculateScore(
  bp: Partial<BuildingProperties>,
  azReserve: number | null | undefined,
  ownerType: string | undefined,
): number {
  let score = 0;

  if (bp.gbauj) {
    if (bp.gbauj < 1960) score += 30;
    else if (bp.gbauj < 1970) score += 25;
    else if (bp.gbauj < 1980) score += 20;
    else if (bp.gbauj < 1990) score += 10;
    else score += 5;
  }

  if (bp.garea) {
    if (bp.garea > 500) score += 20;
    else if (bp.garea > 200) score += 10;
    else score += 5;
  }

  if (bp.gastw && bp.gastw <= 3) score += 10;
  if (bp.gkat === 1030) score += 5;
  if (bp.gkat === 1020) score += 10;

  if (azReserve != null) {
    if (azReserve > 0.5) score += 25;
    else if (azReserve > 0.2) score += 15;
    else if (azReserve > 0) score += 5;
  }

  if (ownerType) {
    if (ownerType === 'Erbengemeinschaft (Potenzial)') score += 15;
    else if (ownerType === 'Privatperson (Potenzial)') score += 10;
    else if (ownerType === 'Firma' || ownerType === 'Immobilienfirma') score -= 5;
  }

  return Math.min(Math.max(score, 0), 100);
}

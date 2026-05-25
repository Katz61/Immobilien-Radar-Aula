const GKAT_MAP: Record<number, string> = {
  1010: 'Provisorische Unterkunft',
  1020: 'Einfamilienhaus',
  1030: 'Mehrfamilienhaus',
  1040: 'Wohngebäude mit Nebennutzung',
  1060: 'Gebäude mit teilweiser Wohnnutzung',
  1080: 'Gebäude ohne Wohnnutzung',
};

const GKLAS_MAP: Record<number, string> = {
  1110: 'Alleinstehend', 1121: 'Doppelhaus', 1122: 'Reihenhaus',
  1130: 'Terrassenhaus', 1211: 'Hotel', 1212: 'Klinik/Spital',
  1220: 'Büro', 1230: 'Gewerbe', 1231: 'Industrie',
  1241: 'Kirche', 1242: 'Schulhaus', 1243: 'Sporthalle',
  1251: 'Parkhaus', 1261: 'Landwirtschaft', 1262: 'Gartenhaus',
  1263: 'Stall', 1264: 'Treibhaus', 1275: 'Kapelle', 1276: 'Sonstiges',
};

const HEATING_MAP: Record<number, string> = {
  7410: 'Fernwärme', 7420: 'Einzelofenheizung', 7430: 'Zentralheizung',
  7431: 'Ölfeuerung', 7432: 'Gasfeuerung', 7433: 'Holzfeuerung',
  7434: 'Kohlefeuerung', 7435: 'Pelletheizung', 7436: 'Stückholzheizung',
  7440: 'Wärmepumpe', 7441: 'Luft-Wasser', 7442: 'Erdwärme',
  7443: 'Grundwasser', 7450: 'Elektroheizung', 7451: 'Elektrospeicher',
  7452: 'Elektrodirekt', 7460: 'Zentralheizung', 7499: 'Andere',
};

const ENERGY_MAP: Record<number, string> = {
  7500: 'Luft', 7501: 'Erdwärme', 7510: 'Heizöl', 7520: 'Kohle',
  7530: 'Gas', 7540: 'Elektrizität', 7541: 'Solarenergie',
  7542: 'Windenergie', 7550: 'Holz', 7560: 'Fernwärme',
  7570: 'Abwärme', 7580: 'Andere', 7598: 'Unbestimmt',
};

export function decodeGkat(code: number | undefined): string {
  if (!code) return '\u2014';
  return GKAT_MAP[code] ?? `Code ${code}`;
}

export function decodeGklas(code: number | undefined): string {
  if (!code) return '\u2014';
  return GKLAS_MAP[code] ?? `Code ${code}`;
}

export function decodeHeating(code: number | undefined): string {
  if (!code) return '\u2014';
  return HEATING_MAP[code] ?? `Code ${code}`;
}

export function decodeEnergy(code: number | undefined): string {
  if (!code) return '\u2014';
  return ENERGY_MAP[code] ?? `Code ${code}`;
}

import type { AZEntry } from '../types';

// Max. AZ values per zone type from Bauordnungen Kanton Zug
// Source: Bauordnung Stadt Zug 2009, Bauordnung Baar, Cham, etc.
export const AZ_LOOKUP: Record<string, AZEntry> = {
  // Stadt Zug (Bauordnung 7. April 2009, § 36)
  'Wohnzone 1':     { az: 0.25, geschosse: 1 },
  'Wohnzone 2':     { az: 0.50, geschosse: 2 },
  'Wohnzone 2A':    { az: 0.40, geschosse: 2 },
  'Wohnzone 2B':    { az: 0.50, geschosse: 2 },
  'Wohnzone 2C':    { az: 0.50, geschosse: 2 },
  'Wohnzone 3':     { az: 0.65, geschosse: 3 },
  'Wohnzone 4':     { az: 0.75, geschosse: 4 },
  'Wohn- und Arbeitszone 2': { az: 0.60, geschosse: 2 },
  'Wohn- und Arbeitszone 3': { az: 0.80, geschosse: 3 },
  'Wohn- und Arbeitszone 4': { az: 1.00, geschosse: 4 },
  'Wohn- und Arbeitszone 5': { az: 1.50, geschosse: 5 },
  'Wohn- und Arbeitszone A': { az: 4.00, geschosse: null },
  'Wohn- und Arbeitszone B': { az: 5.00, geschosse: null },
  'Kernzone A':     { az: 1.00, geschosse: null },
  'Kernzone B':     { az: 1.10, geschosse: 4 },
  'Kernzone C':     { az: 2.10, geschosse: 5 },
  'Kernzone D':     { az: 0.70, geschosse: 3 },
  'Arbeitszone A':  { az: 8.00, geschosse: null },
  // Cham (Bauordnung)
  'Wohn-/Arbeitszone WA3': { az: 0.70, geschosse: 3 },
  'Wohn-/Arbeitszone WA4': { az: 1.00, geschosse: 4 },
  // Generic fallbacks based on geodienste.ch typ_kantonal codes
  'Wohnzone':       { az: 0.50, geschosse: 2 },
  'Mischzone':      { az: 0.80, geschosse: 3 },
  'Kernzone':       { az: 1.10, geschosse: 4 },
  'Arbeitszone':    { az: 1.50, geschosse: null },
};

// Map geodienste.ch kantonal codes to AZ lookup keys
export const ZONE_CODE_MAP: Record<number, string | null> = {
  1101: 'Wohnzone 1',
  1102: 'Wohnzone 2',
  1103: 'Wohnzone 3',
  1104: 'Wohnzone 4',
  1201: 'Arbeitszone A',
  1202: 'Arbeitszone A',
  1203: 'Arbeitszone A',
  1204: 'Arbeitszone A',
  1301: 'Wohn- und Arbeitszone 2',
  1302: 'Wohn- und Arbeitszone 2',
  1303: 'Wohn- und Arbeitszone 3',
  1304: 'Wohn- und Arbeitszone 4',
  1305: 'Wohn- und Arbeitszone 5',
  1401: 'Kernzone A',
  1402: 'Kernzone B',
  1403: 'Kernzone C',
  1404: 'Kernzone D',
  1501: null,
  1601: null,
};

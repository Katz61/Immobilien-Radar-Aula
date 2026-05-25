import type { MarktdatenQuelle, RenditeParams } from '../types';

// Quelle 1: RealAdvisor.ch — Median-Verkaufspreise & Jahresmieten
// https://realadvisor.ch/de/immobilienpreise-pro-m2/kanton-zug
// Stand: Mai 2026
export const REALADVISOR_PREISE: MarktdatenQuelle & { verkaufHaus: Record<string, number>; miete: Record<string, number> } = {
  verkauf: {
    'Zug': 18834, 'Baar': 15504, 'Cham': 14781, 'Risch': 15383,
    'Steinhausen': 14189, 'Hünenberg': 13827, 'Unterägeri': 14090,
    'Oberägeri': 16428, 'Menzingen': 12774, 'Walchwil': 18654,
    'Neuheim': 12902, 'default': 15693,
  },
  verkaufHaus: {
    'Zug': 18020, 'Baar': 15273, 'Cham': 14773, 'Risch': 15209,
    'Steinhausen': 14354, 'Hünenberg': 14412, 'Unterägeri': 15018,
    'Oberägeri': 17269, 'Menzingen': 12547, 'Walchwil': 19215,
    'Neuheim': 12067, 'default': 15505,
  },
  miete: {
    'Zug': 480, 'Baar': 420, 'Cham': 400, 'Risch': 410,
    'Steinhausen': 390, 'Hünenberg': 380, 'Unterägeri': 385,
    'Oberägeri': 440, 'Menzingen': 350, 'Walchwil': 470,
    'Neuheim': 355, 'default': 433,
  },
  url: 'https://realadvisor.ch/de/immobilienpreise-pro-m2/kanton-zug',
  stand: 'Mai 2026',
};

// Quelle 2: Comparis.ch — Durchschnittliche Kaufpreise pro m²
// https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/
// Stand: März 2024
export const COMPARIS_PREISE: MarktdatenQuelle & { urls: Record<string, string> } = {
  verkauf: {
    'Zug': 14933, 'Baar': 14335, 'Cham': 13351, 'Risch': 13500,
    'Steinhausen': 13200, 'Hünenberg': 12800, 'Unterägeri': 13100,
    'Oberägeri': 14500, 'Menzingen': 11800, 'Walchwil': 15302,
    'Neuheim': 11534, 'default': 13500,
  },
  urls: {
    'Zug': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/zug-6300',
    'Baar': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/baar-6340',
    'Cham': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/cham-6330',
    'Risch': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/rotkreuz-6343',
    'Steinhausen': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/steinhausen-6312',
    'Hünenberg': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/huenenberg-6331',
    'Unterägeri': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/unteraegeri-6314',
    'Oberägeri': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/oberaegeri-6315',
    'Menzingen': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/menzingen-6313',
    'Walchwil': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/walchwil-6318',
    'Neuheim': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise/kanton-zug/neuheim-6345',
    'default': 'https://www.comparis.ch/immobilien/verkaufen/immobilienpreise',
  },
  stand: 'Mär 2024',
};

// Quelle 3: immobilienindex.ch — Baulandpreise CHF/m²
// Stand: 2026
export const BODENPREISE: { preise: Record<string, number>; urls: Record<string, string>; stand: string } = {
  preise: {
    'Zug': 2633, 'Baar': 1761, 'Cham': 2057, 'Risch': 1845,
    'Steinhausen': 1772, 'Hünenberg': 2103, 'Unterägeri': 1695,
    'Oberägeri': 1618, 'Menzingen': 1657, 'Walchwil': 1849,
    'Neuheim': 1950, 'default': 2000,
  },
  urls: {
    'Zug': 'https://www.immobilienindex.ch/ZG/Zug/',
    'Baar': 'https://www.immobilienindex.ch/ZG/Baar/',
    'Cham': 'https://www.immobilienindex.ch/ZG/Cham/',
    'Risch': 'https://www.immobilienindex.ch/ZG/Risch/',
    'Steinhausen': 'https://www.immobilienindex.ch/ZG/Steinhausen/',
    'Hünenberg': 'https://www.immobilienindex.ch/ZG/Huenenberg/',
    'Unterägeri': 'https://www.immobilienindex.ch/ZG/Unteraegeri/',
    'Oberägeri': 'https://www.immobilienindex.ch/ZG/Oberaegeri/',
    'Menzingen': 'https://www.immobilienindex.ch/ZG/Menzingen/',
    'Walchwil': 'https://www.immobilienindex.ch/ZG/Walchwil/',
    'Neuheim': 'https://www.immobilienindex.ch/ZG/Neuheim/',
    'default': 'https://www.immobilienindex.ch/ZG/Zug/',
  },
  stand: '2026',
};

export const RENDITE_PARAMS: RenditeParams = {
  landwert: {
    'Wohnzone 1': 0.8, 'Wohnzone 2': 1.0, 'Wohnzone 3': 1.2,
    'Wohnzone 4': 1.4, 'Wohnzone 5': 1.6,
    'Kernzone': 1.8, 'Mischzone': 1.1, 'Zentrumszone': 2.0,
    'Arbeitszone': 0.6, 'default': 1.0,
  },
  baukosten: {
    neubau: 5500,
    sanierung: 2800,
    aufstockung: 4200,
  },
  miete: {
    'Wohnzone 1': 320, 'Wohnzone 2': 360, 'Wohnzone 3': 400,
    'Wohnzone 4': 420, 'Wohnzone 5': 440,
    'Kernzone': 470, 'Mischzone': 380, 'Zentrumszone': 490,
    'Arbeitszone': 280, 'default': 400,
  },
  betriebskosten_pct: 0.18,
  verkaufsfaktor: 35,
  abbruchkosten_m2: 120,
};

export const LEAD_STATUSES: Record<string, { label: string; icon: string; color: string }> = {
  'neu':           { label: 'Neu',           icon: '🔵', color: 'var(--blue)' },
  'kontakt':       { label: 'Kontaktiert',   icon: '🟡', color: 'var(--yellow)' },
  'besichtigung':  { label: 'Besichtigung',  icon: '🟢', color: 'var(--accent)' },
  'angebot':       { label: 'Angebot',       icon: '💚', color: 'var(--accent2)' },
  'abgelehnt':     { label: 'Abgelehnt',     icon: '🔴', color: 'var(--red)' },
  'erledigt':      { label: 'Erledigt',      icon: '⚫', color: 'var(--muted)' },
};

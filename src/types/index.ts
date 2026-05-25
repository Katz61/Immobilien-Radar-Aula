export type LeadStatus = 'neu' | 'kontakt' | 'besichtigung' | 'angebot' | 'abgelehnt' | 'erledigt';

export interface LeadStatusInfo {
  label: string;
  icon: string;
  color: string;
}

export interface Lead {
  id: number;
  egrid: string;
  egid: number | null;
  parcelNr: string;
  address: string;
  plz: string;
  ort: string;
  gemeinde: string;
  baujahr: number | null;
  flaeche: number | null;
  geschosse: number | null;
  wohnungen: number | null;
  kategorie: string;
  heizung: string;
  bezeichnung: string;
  zonentyp: string;
  azMax: number | null;
  azActual: number | null;
  azReserve: number | null;
  ownerType: string;
  ownerHints: string;
  companies: string;
  solarKlasse: string;
  solarStrom: number | string;
  lat: number;
  lon: number;
  buildings: number;
  score: number;
  status: LeadStatus;
  notes: string;
  savedAt: string;
}

export interface GemeindeInfo {
  lat: number;
  lon: number;
  bbox: [number, number, number, number];
}

export interface AZEntry {
  az: number;
  geschosse: number | null;
}

export interface ZoneInfo {
  zonentyp: string;
  zonencode: number | null;
  kommunal: string;
  hauptnutzung: string;
  kanton: string;
}

export interface SolarData {
  klasse: number;
  klasseText: string;
  stromertrag: number;
  flaeche: number;
  neigung: number;
  mstrahlung: number;
  finanzertrag: number;
}

export interface OwnerInfo {
  type: string;
  confidence: string;
  companies: Company[];
  hints: string[];
}

export interface Company {
  name: string;
  type: string;
  uid: string;
  street: string;
}

export interface IdentifiedFeature {
  parcel: ParcelResult | null;
  buildings: BuildingResult[];
  lat: number;
  lon: number;
  e: number;
  n: number;
  zoneInfo: ZoneInfo | null;
  solarData: SolarData | null;
  gemeinde: string;
  ownerInfo?: OwnerInfo;
}

export interface ParcelResult {
  properties: Record<string, string | number>;
  geometry?: GeoJSON.Geometry;
}

export interface BuildingResult {
  properties: BuildingProperties;
}

export interface BuildingProperties {
  egid: number;
  egrid: string;
  gbauj: number;
  garea: number;
  gastw: number;
  ganzwhg: number;
  gkat: number;
  gkat_text?: string;
  gklas: number;
  gklas_text?: string;
  gwaerzh1: number;
  genh1: number;
  gbez: string;
  gebnr: string;
  lparz: string;
  strname: string;
  deinr: string;
  strname_deinr: string;
  dplz4: string;
  dplzname: string;
  ggdename: string;
}

export interface RenditeParams {
  landwert: Record<string, number>;
  baukosten: {
    neubau: number;
    sanierung: number;
    aufstockung: number;
  };
  miete: Record<string, number>;
  betriebskosten_pct: number;
  verkaufsfaktor: number;
  abbruchkosten_m2: number;
}

export interface MarktdatenQuelle {
  verkauf: Record<string, number>;
  verkaufHaus?: Record<string, number>;
  miete?: Record<string, number>;
  urls?: Record<string, string>;
  url?: string;
  stand: string;
}

export type SortOption = 'score' | 'az' | 'baujahr' | 'flaeche' | 'status';

export interface LeadFilters {
  sortBy: SortOption;
  ownerFilter: string;
  statusFilter: string;
  minScore: number;
  hideDone: boolean;
}

import type { BuildingResult, ParcelResult } from '../types';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

interface IdentifyResponse {
  results: Array<{ properties: Record<string, unknown>; geometry?: GeoJSON.Geometry }>;
}

interface SearchResponse {
  results: Array<{
    attrs: {
      label: string;
      x: number;
      y: number;
      origin: string;
    };
  }>;
}

export async function identifyParcel(e: number, n: number): Promise<ParcelResult | null> {
  const ext = `${e - 100},${n - 100},${e + 100},${n + 100}`;
  const url = `https://api3.geo.admin.ch/rest/services/ech/MapServer/identify?layers=all:ch.kantone.cadastralwebmap-farbe&sr=2056&geometry=${e},${n}&mapExtent=${ext}&imageDisplay=200,200,96&geometryFormat=geojson&geometryType=esriGeometryPoint&limit=1&tolerance=10&returnGeometry=true&lang=de`;
  const data = await fetchJSON<IdentifyResponse>(url);
  const result = data.results?.[0];
  if (!result) return null;
  return {
    properties: result.properties as Record<string, string | number>,
    geometry: result.geometry,
  };
}

export async function identifyBuildings(e: number, n: number): Promise<BuildingResult[]> {
  const url = `https://api3.geo.admin.ch/rest/services/ech/MapServer/identify?layers=all:ch.bfs.gebaeude_wohnungs_register&sr=2056&geometry=${e},${n}&mapExtent=${e - 200},${n - 200},${e + 200},${n + 200}&imageDisplay=200,200,96&geometryFormat=geojson&geometryType=esriGeometryPoint&limit=10&tolerance=50&returnGeometry=false&lang=de`;
  const data = await fetchJSON<IdentifyResponse>(url);
  return (data.results || []).map((r) => ({
    properties: r.properties as unknown as BuildingResult['properties'],
  }));
}

export async function scanBuildings(e: number, n: number): Promise<BuildingResult[]> {
  const url = `https://api3.geo.admin.ch/rest/services/ech/MapServer/identify?layers=all:ch.bfs.gebaeude_wohnungs_register&sr=2056&geometry=${e},${n}&mapExtent=${e - 200},${n - 200},${e + 200},${n + 200}&imageDisplay=200,200,96&geometryFormat=geojson&geometryType=esriGeometryPoint&limit=10&tolerance=50&returnGeometry=false&lang=de`;
  const data = await fetchJSON<IdentifyResponse>(url);
  return (data.results || []).map((r) => ({
    properties: r.properties as unknown as BuildingResult['properties'],
  }));
}

export interface SearchResult {
  label: string;
  lat: number;
  lon: number;
  origin: string;
}

export async function searchAddress(query: string): Promise<SearchResult[]> {
  const url = `https://api3.geo.admin.ch/rest/services/ech/SearchServer?searchText=${encodeURIComponent(query)}&type=locations&origins=address,parcel&sr=4326&limit=10`;
  const data = await fetchJSON<SearchResponse>(url);
  return (data.results || []).map((r) => ({
    label: r.attrs.label.replace(/<\/?b>/g, ''),
    lat: r.attrs.y,
    lon: r.attrs.x,
    origin: r.attrs.origin,
  }));
}

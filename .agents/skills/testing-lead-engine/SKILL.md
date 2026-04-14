# Testing: Integralis Lead Engine

## Overview
The Integralis Lead Engine is a single-page HTML/CSS/JS application that queries real Swiss government APIs (geo.admin.ch, GWR) to find and score building leads in Canton Zug. All data is real — no mocked endpoints.

## Deployment
- Static frontend only (no backend). Deploy via `devinapps.com` frontend deployment.
- The app is a single `index.html` file (~1300 lines).
- No build step, no dependencies to install.

## How to Test

### Prerequisites
- No authentication needed — all APIs are public.
- No secrets required.
- Browser-based testing only (no shell tests needed).
- Clear localStorage before testing for a clean state: `localStorage.clear()` in browser console.

### Test 1: Map Click (Identify)
1. Open the deployed URL
2. Click anywhere on the map within Canton Zug
3. **Verify:** DETAILS tab shows real parcel data (EGRID starting with "CH", Parzellennummer, coordinates)
4. **Verify:** If buildings exist at that location, building cards appear with Baujahr, Fläche, Geschosse, Wohnungen, Heizung
5. **Verify:** External links (ZugMap, ÖREB, Zefix, map.geo.admin.ch) open correctly

### Test 2: Address Search
1. Type an address in the search bar (e.g., "Baarerstrasse Zug")
2. Click SUCHEN
3. **Verify:** Dropdown shows real address suggestions from geo.admin.ch
4. Click a result
5. **Verify:** Map flies to that location and identify runs automatically

### Test 3: Save Lead
1. After identifying a location with buildings, click "ALS LEAD SPEICHERN"
2. **Verify:** Toast notification appears
3. **Verify:** LEADS tab badge count increments
4. Click LEADS tab
5. **Verify:** Lead appears in the list with score, address, Baujahr

### Test 4: Area Scan (Critical)
1. Click SCAN tab
2. Leave defaults: Gemeinde="Zug", Max. Baujahr="vor 1980", Min. Grundfläche="100 m²", Scan-Dichte=25
3. Click "GEBIET SCANNEN"
4. **Verify:** Progress bar moves, status shows "Punkt X/25"
5. **Verify:** After completion: "Scan abgeschlossen: N Gebäude gefunden in Zug." where **N > 0**
6. **Verify:** Results list shows buildings with real addresses, Baujahr, areas
7. **Verify:** Colored markers appear on map

**Known pitfall:** The scan API parameters (limit, tolerance, mapExtent) must match those used in the single-click identify function. If they diverge, the scan may find far fewer buildings. The `startAreaScan()` function (around line 1059) and the `identifyLocation()` function (around line 771) should use identical API parameters.

**Known pitfall:** Swiss urban buildings in old towns are often small (100-270 m²). Setting a minimum area filter above 300 m² will filter out most results. The default should be 100 m² or lower.

### Test 5: CSV Export
1. After Test 4, click "ALLE ALS LEADS SPEICHERN"
2. Switch to LEADS tab
3. Click "CSV EXPORT"
4. **Verify:** File downloads with name `integralis-leads-YYYY-MM-DD.csv`
5. **Verify:** CSV has headers: Score;Adresse;PLZ;Ort;Gemeinde;EGRID;Parzelle;Baujahr;Fläche m²;Geschosse;Wohnungen;Kategorie;Heizung;Bezeichnung;Lat;Lon;Gespeichert
6. **Verify:** EGRID values start with "CH" followed by digits
7. **Note:** Scan count vs saved count may differ — buildings without EGRID ("—") are deduplicated out. This is expected.

## API Reference

### geo.admin.ch Identify API
```
https://api3.geo.admin.ch/rest/services/ech/MapServer/identify
  ?layers=all:ch.bfs.gebaeude_wohnungs_register
  &sr=2056
  &geometry={easting},{northing}
  &mapExtent={e-200},{n-200},{e+200},{n+200}
  &imageDisplay=200,200,96
  &geometryFormat=geojson
  &geometryType=esriGeometryPoint
  &limit=10
  &tolerance=50
  &returnGeometry=false
  &lang=de
```

Key parameters that affect result count:
- `limit`: Number of results per query point (recommended: 10)
- `tolerance`: Spatial tolerance in pixels (recommended: 50)
- `mapExtent`: Search area size (recommended: ±200 from center)

### Coordinate System
- Map uses WGS84 (EPSG:4326) — standard GPS coordinates
- API requires LV95 (EPSG:2056) — Swiss national grid
- Conversion is done client-side in the `toSwissCoords()` function

## Devin Secrets Needed
None — all APIs are public and require no authentication.

## Communication Notes
- The user (Michael) prefers communication in German (informal "du" form)
- Use proper German umlauts (ä, ö, ü)

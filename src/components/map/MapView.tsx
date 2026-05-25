import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../../store/useStore';
import { wgs84ToLV95 } from '../../utils/coordinates';
import { identifyParcel, identifyBuildings } from '../../services/geo-admin';
import { fetchZoneInfo } from '../../services/geodienste';
import { fetchSolarData } from '../../services/solar';
import { fetchCompaniesAtAddress, classifyOwnerType } from '../../services/zefix';
import type { IdentifiedFeature } from '../../types';

export function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const leadMarkersRef = useRef<L.Layer[]>([]);
  const coordsRef = useRef<HTMLSpanElement>(null);

  const setCurrentFeature = useStore((s) => s.setCurrentFeature);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const setIsLoading = useStore((s) => s.setIsLoading);
  const leads = useStore((s) => s.leads);
  const leadMarkersVisible = useStore((s) => s.leadMarkersVisible);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => mapRef.current?.removeLayer(m));
    markersRef.current = [];
  }, []);

  const identifyLocation = useCallback(
    async (lat: number, lon: number) => {
      setActiveTab('details');
      setIsLoading(true);
      setCurrentFeature(null);

      const [e, n] = wgs84ToLV95(lat, lon);

      try {
        const [parcel, buildings, zoneInfo, solarData] = await Promise.all([
          identifyParcel(e, n),
          identifyBuildings(e, n),
          fetchZoneInfo(lat, lon),
          fetchSolarData(e, n).catch(() => null),
        ]);

        if (!parcel && buildings.length === 0) {
          setIsLoading(false);
          return;
        }

        const gemeinde = buildings.length > 0 ? buildings[0].properties?.ggdename || '' : '';
        const feature: IdentifiedFeature = {
          parcel, buildings, lat, lon, e, n, zoneInfo, solarData, gemeinde,
        };
        setCurrentFeature(feature);
        setIsLoading(false);

        clearMarkers();
        const identifyIcon = L.divIcon({
          className: '',
          html: '<div class="identify-marker"></div>',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        const marker = L.marker([lat, lon], { icon: identifyIcon }).addTo(mapRef.current!);
        markersRef.current.push(marker);

        if (parcel?.geometry) {
          try {
            const geoLayer = L.geoJSON(parcel.geometry as GeoJSON.GeoJsonObject, {
              style: { color: '#b8f04a', weight: 2, fillColor: '#b8f04a', fillOpacity: 0.1 },
            }).addTo(mapRef.current!);
            markersRef.current.push(geoLayer);
          } catch { /* ignore geometry errors */ }
        }

        // Async owner lookup
        if (buildings.length > 0) {
          const b0 = buildings[0].properties;
          const addr = b0.strname_deinr || '';
          const ort = b0.ggdename || '';
          const featureRef = feature;
          (async () => {
            let companies: Awaited<ReturnType<typeof fetchCompaniesAtAddress>> = [];
            if (addr && ort) {
              try { companies = await fetchCompaniesAtAddress(addr, ort); } catch { /* ignore */ }
            }
            const ownerInfo = classifyOwnerType(companies, b0);
            featureRef.ownerInfo = ownerInfo;
            const currentFeat = useStore.getState().currentFeature;
            if (currentFeat === featureRef) {
              setCurrentFeature({ ...featureRef });
            }
          })();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    },
    [setActiveTab, setIsLoading, setCurrentFeature, clearMarkers],
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [47.166, 8.516],
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer
      .wms('https://wms.geo.admin.ch/', {
        layers: 'ch.swisstopo.pixelkarte-farbe',
        format: 'image/png',
        transparent: false,
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch">swisstopo</a>',
        maxZoom: 20,
        minZoom: 8,
      })
      .addTo(map);

    L.tileLayer
      .wms('https://wms.geo.admin.ch/', {
        layers: 'ch.kantone.cadastralwebmap-farbe',
        format: 'image/png',
        transparent: true,
        opacity: 0.5,
        maxZoom: 20,
        minZoom: 14,
      })
      .addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      identifyLocation(e.latlng.lat, e.latlng.lng);
    });

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const [eCoord, nCoord] = wgs84ToLV95(e.latlng.lat, e.latlng.lng);
      if (coordsRef.current) {
        coordsRef.current.textContent = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)} | LV95: ${Math.round(eCoord)}, ${Math.round(nCoord)}`;
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [identifyLocation]);

  // Handle custom events from search and scan
  useEffect(() => {
    const handleFlyTo = (e: Event) => {
      const { lat, lon, zoom } = (e as CustomEvent).detail;
      mapRef.current?.flyTo([lat, lon], zoom ?? 18);
    };
    const handleIdentify = (e: Event) => {
      const { lat, lon } = (e as CustomEvent).detail;
      identifyLocation(lat, lon);
    };
    const handleAddMarker = (e: Event) => {
      const { lat, lon, score, popup } = (e as CustomEvent).detail;
      if (!mapRef.current) return;
      const scoreClass = score >= 60 ? 'score-high' : score >= 35 ? 'score-med' : 'score-low';
      const markerSize = score >= 60 ? 32 : score >= 35 ? 28 : 24;
      const icon = L.divIcon({
        className: '',
        html: `<div class="scan-marker ${scoreClass}" style="width:${markerSize}px;height:${markerSize}px;">${score}</div>`,
        iconSize: [markerSize, markerSize + 6],
        iconAnchor: [markerSize / 2, markerSize + 6],
      });
      const m = L.marker([lat, lon], { icon }).addTo(mapRef.current);
      if (popup) m.bindPopup(popup);
      markersRef.current.push(m);
    };
    const handleClearMarkers = () => clearMarkers();

    window.addEventListener('map:flyto', handleFlyTo);
    window.addEventListener('map:identify', handleIdentify);
    window.addEventListener('map:addMarker', handleAddMarker);
    window.addEventListener('map:clearMarkers', handleClearMarkers);
    return () => {
      window.removeEventListener('map:flyto', handleFlyTo);
      window.removeEventListener('map:identify', handleIdentify);
      window.removeEventListener('map:addMarker', handleAddMarker);
      window.removeEventListener('map:clearMarkers', handleClearMarkers);
    };
  }, [identifyLocation, clearMarkers]);

  // Lead markers
  useEffect(() => {
    leadMarkersRef.current.forEach((m) => mapRef.current?.removeLayer(m));
    leadMarkersRef.current = [];

    if (!leadMarkersVisible || !mapRef.current) return;

    leads.forEach((l) => {
      if (!l.lat || !l.lon) return;
      const scoreColor = l.score >= 60 ? '#b8f04a' : l.score >= 35 ? '#f0c44a' : '#9aa89e';
      const scoreBorder = l.score >= 60 ? '#8bc834' : l.score >= 35 ? '#d4a830' : '#6b7a70';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${scoreColor};border:2px solid ${scoreBorder};box-shadow:0 0 6px rgba(0,0,0,0.5)" title="${l.address} — Score ${l.score}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const m = L.marker([l.lat, l.lon], { icon }).addTo(mapRef.current!);
      m.bindPopup(
        `<b>${l.address}</b><br>Score: ${l.score}${l.notes ? '<br><i>' + l.notes.substring(0, 80) + '</i>' : ''}`,
      );
      leadMarkersRef.current.push(m);
    });
  }, [leads, leadMarkersVisible]);

  return (
    <div className="flex-1 flex flex-col relative">
      <div ref={containerRef} id="map" className="flex-1 bg-bg" />
      <div className="absolute bottom-4 left-4 z-[500] bg-bg/92 border border-border rounded-sm px-3.5 py-2.5 font-mono text-[11px] text-text2 backdrop-blur-sm pointer-events-none">
        Koordinaten: <span ref={coordsRef} className="text-accent">&mdash;</span>
      </div>
    </div>
  );
}

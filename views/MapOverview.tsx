
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { calculateOfflineRoute, Coordinate, RouteResult } from '../services/map/geoEngine';

// Declaración global para Leaflet para evitar errores de TS sin instalar types
declare global {
  interface Window {
    L: any;
  }
}

const MapOverview: React.FC = () => {
  const navigate = useNavigate();
  const { t, downloadedCircuits } = useUser();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  // Estado para el panel inferior y navegación
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  
  // Estado de Ruteo
  // Inicio simulado al sur de la plaza
  const [userLocation, setUserLocation] = useState<Coordinate>({ lat: -25.10600, lng: -65.53455 });
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Verificar si el pack de mapas está descargado
  const isOfflineReady = downloadedCircuits.includes('chicoana-map-pack');

  // 1. INYECTAR LEAFLET (Estilo y Script)
  useEffect(() => {
    // CORRECCIÓN: Verificar si Leaflet ya está disponible en window (cargado por otra vista)
    if (window.L || document.getElementById('leaflet-js')) {
        setMapReady(true);
        return;
    }

    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setMapReady(true);
    document.body.appendChild(script);
  }, []);

  // 2. INICIALIZAR MAPA
  useEffect(() => {
    if (mapReady && mapContainerRef.current && !mapInstanceRef.current) {
        const L = window.L;
        
        // Iconos personalizados
        const userIcon = L.divIcon({
            className: 'custom-user-icon',
            html: `<div style="background-color:#3b82f6; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Crear mapa centrado en Chicoana Plaza
        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([-25.10445, -65.53455], 17);

        // Capa OSM (Online) - Nota: En offline real se usarían tiles cacheados localmente
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
        
        // Atribución manual discreta
        L.control.attribution({ prefix: false }).addAttribution('© OpenStreetMap').addTo(map);

        // Marcador Usuario
        markerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);

        // Marcador Plaza
        const plazaIcon = L.divIcon({
            className: 'custom-poi-icon',
            html: `<div style="background-color:#ef4444; width:24px; height:24px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3); color:white; font-size:14px;"><span class="material-symbols-outlined" style="font-size:16px">flag</span></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });
        
        const plazaMarker = L.marker([-25.10445, -65.53455], { icon: plazaIcon }).addTo(map);
        plazaMarker.on('click', () => {
             setIsSheetExpanded(true);
             map.flyTo([-25.10445, -65.53455], 18);
        });

        mapInstanceRef.current = map;
    }
  }, [mapReady]);

  // 3. ACTUALIZAR POSICIÓN USUARIO
  useEffect(() => {
      if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
  }, [userLocation]);

  // 4. SIMULACIÓN DE MOVIMIENTO
  useEffect(() => {
    let interval: number;
    if (activeRoute && mapInstanceRef.current && window.L) {
        let step = 0;
        // Dibujar ruta en mapa
        if (routeLayerRef.current) mapInstanceRef.current.removeLayer(routeLayerRef.current);
        
        const latLngs = activeRoute.path.map(p => [p.lat, p.lng]);
        routeLayerRef.current = window.L.polyline(latLngs, { color: '#80ec13', weight: 6, opacity: 0.8 }).addTo(mapInstanceRef.current);
        
        // Ajustar vista a la ruta
        mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });

        // Animar movimiento
        interval = window.setInterval(() => {
            step++;
            if (step < activeRoute.path.length) {
                setUserLocation(activeRoute.path[step]);
            }
        }, 500);
    }
    return () => clearInterval(interval);
  }, [activeRoute]);

  const handleCalculateRoute = () => {
      // Calcular ruta desde usuario (Sur) hacia la Plaza (Centro)
      const route = calculateOfflineRoute(userLocation, { lat: -25.10445, lng: -65.53455 }, 'walking');
      if (route) {
          setActiveRoute(route);
          setIsSheetExpanded(false);
      } else {
          alert('No se pudo calcular la ruta offline.');
      }
  };

  const handleZoom = (delta: number) => {
      if(mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
      }
  }

  const handleRecenter = () => {
      if(mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 17);
      }
  }

  return (
    <div className="relative w-full h-screen bg-gray-200 dark:bg-[#0f0f0f] overflow-hidden font-display select-none">
      
      {/* --- MAP CONTAINER (Leaflet) --- */}
      <div id="map-container" ref={mapContainerRef} className="absolute inset-0 z-0"></div>
      
      {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">public</span>
          </div>
      )}

      {/* --- UI CONTROLS --- */}
      
      {/* Top Pills */}
      <div className="absolute top-0 left-0 w-full p-4 pt-safe-top z-40 pointer-events-none">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pointer-events-auto">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border active:scale-95 transition-transform ${isOfflineReady ? 'bg-green-100 border-green-200' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700'}`}>
               <span className={`material-symbols-outlined text-base ${isOfflineReady ? 'text-green-600' : 'text-gray-500'}`}>{isOfflineReady ? 'check_circle' : 'wifi_off'}</span>
               <span className={`text-xs font-bold ${isOfflineReady ? 'text-green-800' : 'text-gray-700 dark:text-gray-200'}`}>{isOfflineReady ? 'Mapa Offline' : t('map.offline_pill')}</span>
            </button>
             <button className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-base text-green-600">my_location</span>
               <span className="text-xs font-bold text-green-700">{t('map.gps_active')}</span>
            </button>
         </div>
      </div>

      {/* Right Side Controls (Zoom & Recenter) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <button 
            onClick={() => handleZoom(1)}
            className="w-11 h-11 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
          <button 
            onClick={() => handleZoom(-1)}
            className="w-11 h-11 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">remove</span>
          </button>
        </div>

        {/* Recenter Button */}
        <button 
           onClick={handleRecenter}
           className="w-12 h-12 bg-primary rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center text-black active:scale-90 transition-transform"
         >
            <span className="material-symbols-outlined text-2xl">crosshairs_gps</span>
         </button>
      </div>

      {/* --- BOTTOM SHEET (UI Original Mantenida) --- */}
      <div className={`absolute left-4 right-4 z-40 transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${isSheetExpanded ? 'bottom-4 top-[50%]' : 'bottom-20 h-auto'}`}>
         <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-800 h-full flex flex-col">
            
            {/* Handle */}
            <div 
              className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 cursor-pointer"
              onClick={() => setIsSheetExpanded(!isSheetExpanded)}
            ></div>
            
            <div className="flex justify-between items-start mb-2">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('map.next_dest')}</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{t('map.poi_plaza')}</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="flex items-center gap-1 text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-sm">directions_walk</span>
                        <span className="text-xs font-bold">5 min</span>
                     </div>
                     <span className="text-gray-300">•</span>
                     <span className="text-xs text-gray-500">{t('map.historic_tag')}</span>
                  </div>
               </div>
               
               <div className="text-right">
                  <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">300m</p>
                  <button 
                    onClick={() => setIsSheetExpanded(!isSheetExpanded)}
                    className="mt-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto transition-colors text-gray-600 dark:text-gray-300"
                  >
                     {isSheetExpanded ? t('map.reduce') : t('map.expand')} 
                     <span className={`material-symbols-outlined text-sm transition-transform ${isSheetExpanded ? 'rotate-180' : ''}`}>expand_less</span>
                  </button>
               </div>
            </div>

            {/* Expanded Content */}
            <div className={`overflow-y-auto flex-1 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 transition-opacity duration-300 ${isSheetExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
               <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {t('map.plaza_desc')}
               </p>
               
               {/* Quick Buttons */}
               <div className="flex gap-3 mb-6">
                   <button 
                     onClick={handleCalculateRoute}
                     className="flex-1 bg-primary text-black py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                   >
                       <span className="material-symbols-outlined">directions</span>
                       {t('navigation.title')}
                   </button>
                   <button 
                     onClick={() => navigate('/poi/plaza-principal')}
                     className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                   >
                       {t('map.view_details')}
                   </button>
               </div>

               <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase mb-3">{t('map.services')}</h4>
               <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-100 dark:border-gray-700">
                     <span className="material-symbols-outlined text-gray-500">schedule</span>
                     <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{t('map.open_24')}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-100 dark:border-gray-700">
                     <span className="material-symbols-outlined text-gray-500">wc</span>
                     <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{t('map.bathrooms')}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-100 dark:border-gray-700">
                     <span className="material-symbols-outlined text-gray-500">wifi</span>
                     <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{t('map.free')}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
    </div>
  );
};

export default MapOverview;

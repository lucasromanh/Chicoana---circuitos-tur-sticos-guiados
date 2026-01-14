
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CIRCUITS } from '../constants';
import { useUser } from '../contexts/UserContext';
import { calculateOfflineRoute, Coordinate, RouteResult } from '../services/map/geoEngine';

declare global {
  interface Window {
    L: any;
  }
}

const ActiveNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, circuits, downloadedCircuits, simulateDownload } = useUser();
  
  const state = location.state as { circuitId: string } | null;
  const activeCircuitId = state?.circuitId || 'historic-center';
  const activeCircuit = circuits.find(c => c.id === activeCircuitId) || CIRCUITS[0];
  
  const isCarMode = activeCircuit ? parseInt(activeCircuit.distance) > 10 : false;
  const isMapDownloaded = downloadedCircuits.includes('chicoana-map-pack');

  const [distance, setDistance] = useState(isCarMode ? 5000 : 50);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);

  // --- MAP STATE ---
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Simulation State
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate>({ lat: -25.10600, lng: -65.53455 }); 
  const [isFollowing, setIsFollowing] = useState(true); // Controla si la cámara sigue al usuario

  // 1. INYECTAR LEAFLET
  useEffect(() => {
    if (document.getElementById('leaflet-css')) {
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

  // 2. INICIALIZAR MAPA Y CALCULAR RUTA DEMO
  useEffect(() => {
    if (mapReady && mapContainerRef.current && !mapInstanceRef.current) {
        const L = window.L;
        
        // Inicializar mapa centrado (Zoom 18 en lugar de 19 para ver mejor el contexto)
        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            zoomAnimation: true
        }).setView([userLocation.lat, userLocation.lng], 18);

        // Capa OSM
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // === FIX: DETECTAR INTERACCIÓN PARA PARAR EL AUTO-CENTRADO ===
        map.on('dragstart', () => {
            setIsFollowing(false);
        });
        // =============================================================

        // Icono de Navegación (Flecha)
        const navIcon = L.divIcon({
            className: 'nav-arrow-icon',
            html: `
              <div style="
                width: 0; 
                height: 0; 
                border-left: 12px solid transparent;
                border-right: 12px solid transparent;
                border-bottom: 24px solid #3b82f6; 
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
                transform: translate(-50%, -50%);
              "></div>
              <div style="
                position: absolute;
                top: 10px; left: -15px;
                width: 30px; height: 30px;
                background: rgba(59, 130, 246, 0.2);
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
        });

        markerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: navIcon, zIndexOffset: 1000 }).addTo(map);
        mapInstanceRef.current = map;

        // CALCULAR RUTA VISUAL (Simulada para la demo)
        const route = calculateOfflineRoute(
            { lat: -25.10600, lng: -65.53455 }, 
            { lat: -25.10445, lng: -65.53455 }, 
            'walking'
        );
        
        if (route) {
            setActiveRoute(route);
            const latLngs = route.path.map(p => [p.lat, p.lng]);
            // Sombra de ruta
            L.polyline(latLngs, { color: '#1a5f7a', weight: 10, opacity: 0.3 }).addTo(map);
            // Ruta principal
            routeLayerRef.current = L.polyline(latLngs, { color: '#3b82f6', weight: 7, opacity: 0.9 }).addTo(map);
            
            // Ajustar vista inicial para ver parte del recorrido
            // map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
        }
    }
  }, [mapReady]);

  // 3. SIMULACIÓN DE MOVIMIENTO SUAVE
  useEffect(() => {
    if (!activeRoute || !mapInstanceRef.current || !markerRef.current) return;
    
    let currentIndex = 0;
    const path = activeRoute.path;
    const L = window.L;

    const interval = setInterval(() => {
        if (currentIndex >= path.length - 1) {
            currentIndex = 0; // Reiniciar bucle
            setDistance(50);
        }

        const currentPos = path[currentIndex];
        const newLatLng = new L.LatLng(currentPos.lat, currentPos.lng);
        
        // Mover marcador (siempre se mueve)
        markerRef.current.setLatLng(newLatLng);

        // === FIX: SOLO MOVER CÁMARA SI ESTÁ EN MODO SEGUIMIENTO ===
        if (isFollowing) {
            // Usar panTo con duración para suavizar el movimiento "loco"
            mapInstanceRef.current.panTo(newLatLng, { animate: true, duration: 0.8 });
        }
        // ===========================================================

        setDistance(prev => Math.max(0, prev - 2));
        currentIndex++;
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRoute, mapReady, isFollowing]); // Dependencia clave: isFollowing

  const handleRecenter = () => {
    if (mapInstanceRef.current && markerRef.current) {
        setIsFollowing(true);
        const latLng = markerRef.current.getLatLng();
        mapInstanceRef.current.flyTo(latLng, 18, { animate: true });
    }
  };

  const handleDownloadMap = async () => {
      setIsDownloadingMap(true);
      await simulateDownload('chicoana-map-pack');
      setIsDownloadingMap(false);
  };

  return (
    <div className="relative w-full h-screen bg-gray-200 dark:bg-gray-900 flex flex-col justify-between overflow-hidden font-display">
      
      {/* --- REAL MAP BACKGROUND (Leaflet) --- */}
      <div id="nav-map-container" ref={mapContainerRef} className="absolute inset-0 z-0"></div>
      
      {/* Overlay gradiente para legibilidad */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white/60 via-transparent to-white/40 dark:from-black/60 dark:to-black/40"></div>

      {/* --- UI OVERLAY --- */}

      {/* 1. Top Bar Information */}
      <div className="absolute top-4 left-3 right-3 z-20 pt-safe-top">
         <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-1.5 pl-2 pr-2 flex items-center justify-between border border-gray-100 dark:border-gray-800 backdrop-blur-md bg-opacity-90">
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white transition-colors">
               <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex-1 px-3 min-w-0">
               <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">{activeCircuit?.title || t('navigation.title')}</h3>
               <p className="text-[10px] text-gray-500 font-medium truncate">15 {t('navigation.min_left')} • 1.2 {t('circuit.distance')}</p>
            </div>
            
            {/* Botón de Descarga de Mapa Offline */}
            {!isMapDownloaded ? (
                <button 
                  onClick={handleDownloadMap}
                  disabled={isDownloadingMap}
                  className="mr-2 px-3 py-1 bg-primary text-black rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform whitespace-nowrap"
                >
                  {isDownloadingMap ? (
                      <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                  ) : (
                      <span className="material-symbols-outlined text-xs">download</span>
                  )}
                  Mapa
                </button>
            ) : (
                 <div className="mr-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                 </div>
            )}

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <span className="material-symbols-outlined text-xl">{isMuted ? 'volume_off' : 'volume_up'}</span>
            </button>
         </div>
      </div>

      {/* 2. Map Controls (Floating Right) */}
      <div className="absolute right-3 top-36 flex flex-col gap-2 z-20">
         <button 
            onClick={handleRecenter}
            className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all border border-gray-100 dark:border-gray-700 ${isFollowing ? 'bg-primary text-black ring-2 ring-primary/50' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white'}`}
         >
            <span className="material-symbols-outlined text-xl">my_location</span>
         </button>
         <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-gray-700 dark:text-white active:scale-95 transition-transform border border-gray-100 dark:border-gray-700">
            <span className="material-symbols-outlined text-xl">layers</span>
         </button>
      </div>

      {/* 3. Bottom Large Card (Instrucciones) */}
      <div className="absolute bottom-4 left-3 right-3 z-30">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl p-5 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
             
             {/* Handle */}
             <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>

             {/* Green Instruction Block */}
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                    <span className="material-symbols-outlined text-[2.5rem] text-black font-bold">turn_right</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1">{t('navigation.turn_right')}</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{t('navigation.in')} <span className="text-gray-900 dark:text-white font-bold">Calle España</span></p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-gray-500">straighten</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{distance}{t('navigation.meters')}</span>
                    </div>
                </div>
             </div>

             <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-6"></div>

             {/* Steps List */}
             <div className="space-y-5 mb-8 pl-1">
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-gray-400 text-sm">arrow_upward</span>
                   </div>
                   <div className="flex-1 border-b border-gray-50 dark:border-gray-800 pb-2">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{t('navigation.go_straight')} 200{t('navigation.meters')}</p>
                      <p className="text-[10px] text-gray-400">{t('navigation.continue_on')} Calle España</p>
                   </div>
                </div>

                {/* Item 2 */}
                 <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-sm">photo_camera</span>
                   </div>
                   <div className="flex-1 border-b border-gray-50 dark:border-gray-800 pb-2">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Plaza Martín Miguel de Güemes</p>
                      <p className="text-[10px] text-gray-400">{t('navigation.poi_nearby')} • Foto</p>
                   </div>
                </div>
                 {/* Item 3 */}
                 <div className="flex items-center gap-4 opacity-60">
                   <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-gray-400 text-sm">church</span>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Iglesia San Pablo</p>
                      <p className="text-[10px] text-gray-400">{t('navigation.dest_final')}</p>
                   </div>
                </div>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3">
                <button className="flex-1 py-3.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                   <span className="material-symbols-outlined text-lg">refresh</span>
                   {t('navigation.recalculate')}
                </button>
                <button 
                  onClick={() => navigate('/home')}
                  className="flex-1 py-3.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                   <span className="material-symbols-outlined text-lg">flag</span>
                   {t('navigation.finish')}
                </button>
             </div>
          </div>
      </div>

    </div>
  );
};

export default ActiveNavigation;

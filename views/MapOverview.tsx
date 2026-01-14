
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const MapOverview: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUser();
  
  // Estado para la transformación del mapa (Pan & Zoom)
  const [transform, setTransform] = useState({ x: -100, y: -100, scale: 1.2 }); // Empezar un poco zoomeado en el centro
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Estado para el panel inferior
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleZoom = (delta: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale + delta, 0.5), 4)
    }));
  };

  return (
    <div className="relative w-full h-screen bg-[#f2f0eb] dark:bg-[#0f0f0f] overflow-hidden font-display select-none">
      
      {/* --- MAP CONTAINER --- */}
      <div 
        className="w-full h-full origin-center cursor-grab active:cursor-grabbing touch-none will-change-transform"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Container Size for the vector map */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]">
          
          {/* CHICOANA REALISTIC VECTOR MAP */}
          <svg viewBox="0 0 1000 1000" className="w-full h-full" style={{ overflow: 'visible' }}>
            
            {/* 1. Base Ground (Barrio/Grid areas) */}
            <rect x="-500" y="-500" width="2000" height="2000" fill="#f2f0eb" className="dark:fill-[#0f0f0f]" />
            
            {/* 2. Áreas Verdes (Campos alrededor) */}
            <path d="M-200 0 Q 0 100 200 0 T 600 100 V 1000 H -200 Z" fill="#e3eed3" className="dark:fill-[#1c1c1e]" />
            <path d="M-200 0 Q -100 -200 -200 -400 H 1200 V 0 Z" fill="#e3eed3" className="dark:fill-[#1c1c1e]" />

            {/* 3. El Rio (Río Chicoana - Simulated Path) */}
            <path d="M-100 600 C 100 580, 400 650, 900 600" fill="none" stroke="#aadaff" strokeWidth="25" strokeLinecap="round" className="dark:stroke-[#2c3e50]" />

            {/* 4. CALLES DE CHICOANA (Grid System) */}
            <g stroke="white" strokeWidth="12" strokeLinecap="square" className="dark:stroke-[#333]">
               {/* Calles Horizontales (Oeste - Este) */}
               <line x1="200" y1="200" x2="800" y2="200" /> {/* Calle Norte */}
               <line x1="200" y1="300" x2="800" y2="300" /> 
               <line x1="150" y1="400" x2="850" y2="400" strokeWidth="14" /> {/* Calle Principal (España/Libertad) */}
               <line x1="200" y1="500" x2="800" y2="500" /> 
               <line x1="250" y1="600" x2="750" y2="600" />

               {/* Calles Verticales (Norte - Sur) */}
               <line x1="300" y1="150" x2="300" y2="650" />
               <line x1="400" y1="150" x2="400" y2="650" />
               <line x1="500" y1="100" x2="500" y2="700" strokeWidth="14" /> {/* Calle Central Vertical */}
               <line x1="600" y1="150" x2="600" y2="650" />
               <line x1="700" y1="200" x2="700" y2="550" />
            </g>

            {/* 5. Ruta Provincial 33 (Av. Los Andes) - Diagonal Main Road */}
            <path d="M450 -100 L 480 300 L 520 800" stroke="#ffffff" strokeWidth="22" fill="none" className="dark:stroke-[#444]" />
            <path d="M450 -100 L 480 300 L 520 800" stroke="#fde68a" strokeWidth="10" fill="none" className="dark:stroke-[#555]" />

            {/* 6. Plaza Martín Miguel de Güemes (Centro exacto del grid) */}
            {/* Ubicada en la intersección central 500,400 */}
            <rect x="440" y="340" width="120" height="120" rx="10" fill="#c7e6a7" className="dark:fill-[#385028]" />
            
            {/* Senderos internos plaza */}
            <path d="M440 340 L 560 460 M 560 340 L 440 460" stroke="white" strokeWidth="2" opacity="0.5" />

            {/* 7. Edificios Clave (Simulados) */}
            <rect x="440" y="310" width="40" height="20" fill="#e5e7eb" className="dark:fill-[#444]" /> {/* Iglesia Norte */}
            <rect x="570" y="350" width="30" height="50" fill="#e5e7eb" className="dark:fill-[#444]" /> {/* Municipalidad Este */}
          </svg>

          {/* --- MARKERS ON THE MAP --- */}
          
          {/* Plaza Principal Marker (Center of Green Square) */}
          <div 
            className="absolute left-[500px] top-[400px] -translate-x-1/2 -translate-y-full z-30 cursor-pointer hover:scale-110 transition-transform origin-bottom"
            onClick={(e) => { e.stopPropagation(); navigate('/poi/plaza-principal'); }}
          >
             <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm mb-1 whitespace-nowrap border border-gray-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-[10px] font-bold text-gray-800">{t('map.poi_plaza')}</p>
             </div>
             <div className="w-10 h-10 mx-auto bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-black text-lg filled">flag</span>
             </div>
             <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white mx-auto -mt-1 drop-shadow-sm"></div>
          </div>

          {/* Iglesia San Pablo (North of Plaza) */}
          <div className="absolute left-[460px] top-[320px] -translate-x-1/2 -translate-y-1/2 z-20">
             <div className="w-8 h-8 bg-white rounded-full border border-gray-100 shadow-md flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-600 text-sm">church</span>
             </div>
          </div>

          {/* Photo Spot (West) */}
          <div className="absolute left-[300px] top-[400px] -translate-x-1/2 -translate-y-1/2 z-20">
             <div className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 text-sm">photo_camera</span>
             </div>
          </div>

          {/* Restaurant (South) */}
          <div className="absolute left-[500px] top-[550px] -translate-x-1/2 -translate-y-1/2 z-20">
             <div className="w-8 h-8 bg-orange-100 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600 text-sm">restaurant</span>
             </div>
          </div>

          {/* User Location (South on RP33) */}
          <div className="absolute left-[520px] top-[600px] z-40 transform -translate-x-1/2 -translate-y-1/2">
             <div className="w-24 h-24 bg-blue-500/10 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             {/* Cono de visión (Direction) */}
             <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] bg-gradient-to-t from-blue-500/20 to-transparent transform -translate-x-1/2 -translate-y-full -rotate-12 origin-bottom clip-path-triangle"></div>
             <div className="w-5 h-5 bg-blue-500 border-[3px] border-white rounded-full shadow-lg relative z-10"></div>
          </div>

          {/* Street Labels */}
          <div className="absolute left-[530px] top-[700px] -rotate-75 text-[8px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
             Av. Los Andes
          </div>
          <div className="absolute left-[700px] top-[410px] text-[8px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
             Calle España
          </div>

        </div>
      </div>


      {/* --- UI CONTROLS --- */}
      
      {/* Top Pills */}
      <div className="absolute top-0 left-0 w-full p-4 pt-safe-top z-40 pointer-events-none">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pointer-events-auto">
            <button className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-base text-gray-500">wifi_off</span>
               <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{t('map.offline_pill')}</span>
            </button>
             <button className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-base text-green-600">my_location</span>
               <span className="text-xs font-bold text-green-700">{t('map.gps_active')}</span>
            </button>
         </div>
      </div>

      {/* Right Side Controls (Zoom & Recenter) - Matches Image 1 Style */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <button 
            onClick={() => handleZoom(0.5)}
            className="w-11 h-11 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
          <button 
            onClick={() => handleZoom(-0.5)}
            className="w-11 h-11 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">remove</span>
          </button>
        </div>

        {/* Recenter Button */}
        <button 
           onClick={() => setTransform({ x: -100, y: -100, scale: 1.2 })}
           className="w-12 h-12 bg-primary rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center text-black active:scale-90 transition-transform"
         >
            <span className="material-symbols-outlined text-2xl">crosshairs_gps</span>
         </button>
      </div>

      {/* --- BOTTOM SHEET (Refined to match Image 1 Clean Style) --- */}
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

               <button 
                 onClick={() => navigate('/poi/plaza-principal')}
                 className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-transform"
               >
                 {t('map.view_details')}
               </button>
            </div>
         </div>
      </div>
      
    </div>
  );
};

export default MapOverview;

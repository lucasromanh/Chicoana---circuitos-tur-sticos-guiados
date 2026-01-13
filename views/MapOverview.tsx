import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MapOverview: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  // Simulated map view (In a real app this would be MapLibreGL)
  return (
    <div className="relative w-full h-screen bg-[#e5e0d8] dark:bg-[#1f2022] overflow-hidden">
      
      {/* Map Background Pattern (Simulating Vector Tiles) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>
      
      {/* Simulated Roads */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-300 dark:stroke-gray-700" style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
        <path d="M-100 200 Q 150 250 400 100 T 800 300" strokeWidth="15" fill="none" />
        <path d="M200 -50 L 250 800" strokeWidth="12" fill="none" />
        <path d="M50 400 L 400 450 L 600 300" strokeWidth="8" fill="none" />
      </svg>
      
      {/* Circuit Route Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
        <path d="M-100 200 Q 150 250 400 100" stroke="#80ec13" strokeWidth="4" fill="none" strokeDasharray="8 4" />
      </svg>

      {/* POI Markers */}
      <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer" onClick={() => navigate('/poi/plaza-principal')}>
        <div className="bg-white p-1 rounded-full shadow-md">
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCILHenv_ZFW8cIdPTU7HDKJ8ZC-Zc_5tEY-JRg-60qk-nBbaqKx7eL6pn1einLfttzeIwXLtO9mY0AabSshqKhorzNRdn6f06w09dzlx3E_TfJT2dJeRYcv2pzclIGv2YksxQ0Gm19quls3EX-45q2Xj0ehFScGnXmoLoo08yq0oDDA6lWWYf17E2j2uxs9r0APWEioGHMjpz3wLXPiz6rMDLf1by46EJ6Wi5Acb67V3bMwFiAxbINbx1cIIlvtRHhOZS1vxhfbxLZ" className="w-8 h-8 rounded-full object-cover" />
        </div>
        <div className="w-0.5 h-3 bg-gray-500"></div>
        <div className="w-2 h-1 bg-gray-400 rounded-full opacity-50 blur-[1px]"></div>
      </div>

      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-10">
        <div className="bg-primary text-black p-2 rounded-full shadow-lg animate-bounce">
           <span className="material-symbols-outlined text-xl">location_on</span>
        </div>
      </div>

      {/* Top Search Bar */}
      <div className="absolute top-0 left-0 w-full p-4 pt-safe-top z-20">
        <div className="bg-white dark:bg-surface-dark shadow-lg rounded-2xl flex items-center p-3 gap-3 border border-gray-100 dark:border-gray-800">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="Buscar puntos, calles..." 
            className="flex-1 bg-transparent outline-none text-sm text-text-main dark:text-white placeholder-gray-400"
          />
          <button className="p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <span className="material-symbols-outlined text-gray-500 text-lg">tune</span>
          </button>
        </div>
        
        {/* Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {['all', 'pois', 'restrooms', 'food'].map(filter => (
             <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border backdrop-blur-sm whitespace-nowrap transition-colors
                  ${activeFilter === filter 
                    ? 'bg-primary border-primary text-black' 
                    : 'bg-white/90 dark:bg-surface-dark/90 border-white dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
             >
                {filter === 'all' ? 'Todo' : filter === 'pois' ? 'Puntos' : filter === 'restrooms' ? 'Baños' : 'Comida'}
             </button>
          ))}
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3 z-20">
        <button className="w-12 h-12 bg-white dark:bg-surface-dark rounded-full shadow-lg flex items-center justify-center text-primary-dark active:bg-gray-50">
          <span className="material-symbols-outlined">my_location</span>
        </button>
        <button className="w-12 h-12 bg-white dark:bg-surface-dark rounded-full shadow-lg flex items-center justify-center text-text-main dark:text-white active:bg-gray-50">
          <span className="material-symbols-outlined">layers</span>
        </button>
      </div>

      {/* Offline Indicator */}
      <div className="absolute top-4 right-4 z-0 opacity-0 pointer-events-none">
         {/* Hidden for layout purposes but would be visible if map fails to load */}
      </div>
      
    </div>
  );
};

export default MapOverview;
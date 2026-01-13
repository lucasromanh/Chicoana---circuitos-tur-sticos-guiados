import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState(150);
  const [instruction, setInstruction] = useState("Gira a la derecha");
  const [street, setStreet] = useState("Av. San Martín");
  
  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(prev => {
        if (prev <= 0) {
           setInstruction("Continúa recto");
           setStreet("Calle Libertad");
           return 200;
        }
        return prev - 10;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-200 dark:bg-gray-900 flex flex-col justify-between overflow-hidden">
      
      {/* 3D Map View Simulation */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Sky */}
         <div className="h-1/3 w-full bg-gradient-to-b from-blue-300 to-blue-100 dark:from-slate-800 dark:to-slate-900"></div>
         {/* Ground */}
         <div className="h-2/3 w-full bg-[#e5e0d8] dark:bg-[#2a2b2e] relative perspective-grid">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-32 bg-gray-400/20 transform perspective-3d rotate-x-60"></div>
         </div>
         {/* Navigation Arrow (User) */}
         <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-primary filter drop-shadow-lg"></div>
         </div>
      </div>

      {/* Top Instruction Card */}
      <div className="m-4 mt-safe-top bg-primary-dark dark:bg-green-900 rounded-2xl p-4 shadow-xl flex items-center gap-4 text-white z-20">
        <div className="w-16 h-16 bg-black/20 rounded-xl flex items-center justify-center shrink-0">
           <span className="material-symbols-outlined text-4xl">turn_right</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display">{distance} m</h2>
          <p className="text-lg opacity-90 font-medium leading-tight">{instruction} en <br/> <span className="font-bold">{street}</span></p>
        </div>
      </div>

      {/* Alert / Contextual Proximity Card (Simulated) */}
      {distance < 50 && (
         <div className="mx-4 mb-2 bg-white dark:bg-surface-dark p-3 rounded-xl shadow-lg border-l-4 border-yellow-400 flex items-center gap-3 animate-fade-in-up z-20">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5mnCsXBbL79G6zx31UirLbifMiYtmaTs7hEINIMNYEAON8fNWwh8J0MT5mV769LcrLKjY8tn3-gBHDt3sgqYY5KQFsoQaTrP7g4biCBWnMr0sS_JXb6jhTQ6ASiRr0bifMHNOBfOTBjSsPmsvQn7tIaV3z5qxDjJrbux_7UiBc94_h4tZaXSWd0ZapQpIE7tPTm7jxXPqKXfooUjP6JPntkLJkGsQ7iirQf5ulLGVHRXFH7i48jKKAnYgr40zi65IDLBMqroAPma0" className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
               <p className="text-xs text-gray-500 uppercase font-bold">A 30 metros</p>
               <p className="font-bold text-sm text-text-main dark:text-white">Iglesia San Pablo</p>
            </div>
            <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined text-black">play_arrow</span>
            </button>
         </div>
      )}

      {/* Bottom Control Bar */}
      <div className="bg-white dark:bg-surface-dark p-6 pb-8 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Arribo</p>
            <p className="text-xl font-bold text-text-main dark:text-white">10:45</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Tiempo</p>
            <p className="text-xl font-bold text-green-600">12 min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Distancia</p>
            <p className="text-xl font-bold text-text-main dark:text-white">1.2 km</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <button className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center gap-2 font-bold text-text-main dark:text-white">
            <span className="material-symbols-outlined">layers</span>
            Ver Ruta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveNavigation;
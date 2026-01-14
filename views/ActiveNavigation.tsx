
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CIRCUITS } from '../constants';
import { useUser } from '../contexts/UserContext';

const ActiveNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, circuits } = useUser();
  
  const state = location.state as { circuitId: string } | null;
  const activeCircuitId = state?.circuitId || 'historic-center';
  const activeCircuit = circuits.find(c => c.id === activeCircuitId) || CIRCUITS[0];
  
  const isCarMode = activeCircuit ? parseInt(activeCircuit.distance) > 10 : false;

  const [distance, setDistance] = useState(isCarMode ? 5000 : 50);
  const [isMuted, setIsMuted] = useState(false);

  // Simulation loop
  useEffect(() => {
    const speed = isCarMode ? 50 : 2; 
    const interval = setInterval(() => {
      setDistance(prev => {
        if (prev <= 0) return 200; // Reset for demo
        return Math.max(0, prev - speed);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCarMode]);

  return (
    <div className="relative w-full h-screen bg-gray-200 dark:bg-gray-900 flex flex-col justify-between overflow-hidden font-display">
      
      {/* 3D Map View Background */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Map Structure */}
         <div className="h-full w-full bg-[#f2f0eb] dark:bg-[#1a1a1a]">
            {/* 3D Perspective Container */}
            <div className="absolute inset-0 w-full h-full" style={{ transform: 'perspective(600px) rotateX(45deg) scale(1.5)', transformOrigin: 'center 70%' }}>
                
                {/* Ground / Green Areas */}
                <div className="absolute top-0 left-0 w-full h-full bg-[#f2f0eb] dark:bg-[#1a1a1a]"></div>
                <div className="absolute top-0 left-[-20%] w-[50%] h-full bg-[#e3eed3] dark:bg-[#24301a]"></div>
                
                {/* ROADS - White clean lines */}
                <div className="absolute inset-0 w-full h-full" style={{ 
                    backgroundImage: `
                        linear-gradient(to right, transparent 49%, white 49%, white 51%, transparent 51%),
                        linear-gradient(to bottom, transparent 49%, white 49%, white 51%, transparent 51%)
                    `,
                    backgroundSize: '200px 200px'
                }}></div>

                {/* The Path being followed (Green) */}
                <div className="absolute left-[50%] top-0 w-4 h-full bg-primary shadow-[0_0_20px_rgba(128,236,19,0.4)] transform -translate-x-1/2"></div>
                
                {/* Buildings (Simple cubes) */}
                <div className="absolute top-[40%] left-[20%] w-20 h-20 bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 transform translate-z-10 shadow-lg"></div>
                <div className="absolute top-[30%] right-[20%] w-32 h-32 bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 transform translate-z-10 shadow-lg"></div>

            </div>
         </div>

         {/* Navigation Arrow (User) */}
         <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            {isCarMode ? (
                 <div className="w-14 h-14 bg-white rounded-full border-4 border-primary flex items-center justify-center shadow-2xl">
                    <span className="material-symbols-outlined text-black text-2xl">directions_car</span>
                 </div>
            ) : (
                <div className="relative">
                   <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[35px] border-b-primary filter drop-shadow-xl"></div>
                   <div className="absolute -bottom-2 -left-4 w-8 h-2 bg-black/20 rounded-full blur-sm"></div>
                </div>
            )}
         </div>
      </div>

      {/* --- UI OVERLAY --- */}

      {/* 1. Top Bar Information */}
      <div className="absolute top-4 left-3 right-3 z-20 pt-safe-top">
         <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-1.5 pl-2 pr-2 flex items-center justify-between border border-gray-100 dark:border-gray-800">
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white transition-colors">
               <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex-1 px-3">
               <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">{activeCircuit?.title || t('navigation.title')}</h3>
               <p className="text-[10px] text-gray-500 font-medium">15 {t('navigation.min_left')} • 1.2 {t('circuit.distance')}</p>
            </div>
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
         <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-gray-700 dark:text-white active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-xl">my_location</span>
         </button>
         <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-gray-700 dark:text-white active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-xl">layers</span>
         </button>
      </div>

      {/* 3. Bottom Large Card */}
      <div className="absolute bottom-4 left-3 right-3 z-30">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl p-5 border border-gray-100 dark:border-gray-800">
             
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

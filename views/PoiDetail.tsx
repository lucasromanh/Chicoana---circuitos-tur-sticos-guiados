import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CIRCUITS } from '../constants';

const PoiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Flatten POIs from all circuits to find the right one (Mock logic)
  const poi = CIRCUITS.flatMap(c => c.pois).find(p => p.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  if (!poi) return <div className="p-8">POI no encontrado</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-safe-bottom">
      <div className="h-96 relative">
         <img src={poi.image} alt={poi.title} className="w-full h-full object-cover" />
         <button 
           onClick={() => navigate(-1)}
           className="absolute top-safe-top left-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full text-white flex items-center justify-center z-10"
         >
            <span className="material-symbols-outlined">arrow_downward</span>
         </button>
         <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 w-full p-6">
            <span className="text-primary font-bold uppercase tracking-wider text-xs mb-2 block">{poi.category}</span>
            <h1 className="text-3xl font-bold text-text-main dark:text-white leading-tight mb-2">{poi.title}</h1>
         </div>
      </div>

      <div className="px-6 relative -mt-4 z-10">
        {/* Audio Player Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800 mb-8">
           <div className="flex items-center justify-between mb-4">
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Audio Guía</p>
                 <p className="text-sm font-bold text-text-main dark:text-white">Historia del lugar</p>
              </div>
              <span className="text-xs font-mono text-gray-500">03:45</span>
           </div>
           
           {/* Progress Bar */}
           <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-primary w-[30%] rounded-full relative"></div>
           </div>

           <div className="flex items-center justify-center gap-8">
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                 <span className="material-symbols-outlined text-3xl">replay_10</span>
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                 <span className="material-symbols-outlined text-4xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                 <span className="material-symbols-outlined text-3xl">forward_10</span>
              </button>
           </div>
        </div>

        {/* Text Content */}
        <div className="prose dark:prose-invert prose-sm">
           <p className="text-gray-600 dark:text-gray-300 leading-7">
             {poi.description} Aquí se detallaría la historia completa del lugar, arquitectura, anécdotas locales y datos de relevancia cultural. La aplicación está diseñada para que este texto sea accesible offline.
           </p>
           <p className="text-gray-600 dark:text-gray-300 leading-7 mt-4">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
           </p>
        </div>

        {/* Gallery Grid (Mock) */}
        <h3 className="font-bold text-lg mt-8 mb-4 dark:text-white">Galería</h3>
        <div className="grid grid-cols-2 gap-3 mb-8">
           <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden">
             <img src="https://source.unsplash.com/random/200x200?architecture" className="w-full h-full object-cover" />
           </div>
           <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden">
             <img src="https://source.unsplash.com/random/200x200?nature" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default PoiDetail;
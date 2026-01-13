import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CIRCUITS } from '../constants';

const CircuitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const circuit = CIRCUITS.find(c => c.id === id);

  if (!circuit) return <div className="p-8 text-center">Circuito no encontrado</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-72">
        <img src={circuit.image} alt={circuit.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-light dark:to-background-dark"></div>
        
        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center z-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
           <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
           <span className="px-2 py-1 bg-primary text-black text-xs font-bold rounded uppercase mb-2 inline-block shadow-sm">
            {circuit.difficulty}
          </span>
          <h1 className="text-3xl font-bold text-text-main dark:text-white leading-tight mb-1">{circuit.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-200 font-medium">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">straighten</span> {circuit.distance}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span> {circuit.duration}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 -mt-2 relative z-10">
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm">
          {circuit.description}
        </p>

        {/* Offline Status Card */}
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${circuit.isDownloaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
               <span className="material-symbols-outlined">{circuit.isDownloaded ? 'check_circle' : 'cloud_download'}</span>
             </div>
             <div>
               <p className="text-sm font-bold text-text-main dark:text-white">
                 {circuit.isDownloaded ? 'Disponible Offline' : 'Descargar Circuito'}
               </p>
               <p className="text-xs text-gray-500">
                 {circuit.isDownloaded ? 'Listo para navegar sin datos' : `Tamaño estimado: ${circuit.downloadSize}`}
               </p>
             </div>
          </div>
          {!circuit.isDownloaded && (
            <button className="px-4 py-2 bg-text-main dark:bg-white text-white dark:text-black text-xs font-bold rounded-full">
              Descargar
            </button>
          )}
        </div>

        {/* POI Timeline */}
        <h2 className="text-lg font-bold mb-4 px-2 dark:text-white">Puntos de Interés</h2>
        <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
          {circuit.pois && circuit.pois.length > 0 ? circuit.pois.map((poi, index) => (
            <div 
              key={poi.id} 
              onClick={() => navigate(`/poi/${poi.id}`)}
              className="relative flex gap-4 cursor-pointer group"
            >
              {/* Timeline Node */}
              <div className="relative z-10 w-7 h-7 rounded-full bg-primary border-4 border-background-light dark:border-background-dark flex items-center justify-center shadow-sm shrink-0">
                <span className="text-[10px] font-bold text-black">{index + 1}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex gap-3">
                  <img src={poi.image} alt={poi.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-text-main dark:text-white truncate pr-2">{poi.title}</h3>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{poi.distanceFromStart}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{poi.description}</p>
                    {poi.audioDuration && (
                      <div className="flex items-center gap-1 mt-2 text-primary-dark dark:text-primary">
                        <span className="material-symbols-outlined text-sm">headphones</span>
                        <span className="text-[10px] font-bold">Audio guia • {poi.audioDuration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="pl-8 text-sm text-gray-500 italic">
              Descarga el circuito para ver los puntos de interés detallados y el mapa offline.
            </div>
          )}
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 pb-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-40">
        <button 
          onClick={() => navigate('/navigation')}
          className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">navigation</span>
          Iniciar Recorrido
        </button>
      </div>
    </div>
  );
};

export default CircuitDetail;
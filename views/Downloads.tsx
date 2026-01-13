import React from 'react';
import { DOWNLOADS } from '../constants';

const Downloads: React.FC = () => {
  return (
    <div className="px-4 pt-12 min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <h1 className="text-2xl font-display font-bold mb-6 dark:text-white">Gestión Offline</h1>
      
      {/* Storage Usage Card */}
      <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
        <div className="flex justify-between items-end mb-2">
           <span className="text-sm font-bold text-gray-500">Almacenamiento</span>
           <span className="text-xs font-mono text-text-main dark:text-white">470 MB / 2 GB</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
           <div className="h-full bg-primary w-[25%]"></div>
           <div className="h-full bg-blue-400 w-[10%]"></div>
        </div>
        <div className="flex gap-4 mt-3 text-xs">
           <div className="flex items-center gap-1 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-primary"></div> Mapas
           </div>
           <div className="flex items-center gap-1 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div> Multimedia
           </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 dark:text-white">Mis Paquetes</h2>
      
      <div className="space-y-4">
        {DOWNLOADS.map(item => (
          <div key={item.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl flex gap-4 border border-gray-100 dark:border-gray-800 shadow-sm">
             <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
             <div className="flex-1">
                <h3 className="font-bold text-text-main dark:text-white">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-2">v{item.version} • {item.size}</p>
                
                {item.status === 'update_available' ? (
                   <button className="text-xs font-bold text-blue-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">update</span> Actualizar
                   </button>
                ) : (
                   <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">check_circle</span> Descargado
                   </div>
                )}
             </div>
             <button className="self-center p-2 text-gray-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">delete</span>
             </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
         <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">add_circle</span>
         <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Descargar más circuitos</p>
         <p className="text-xs text-gray-400">Explora el catálogo para agregar contenido offline</p>
      </div>
    </div>
  );
};

export default Downloads;
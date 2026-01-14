
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AVAILABLE_DOWNLOADS } from '@/constants';
import { useUser } from '@/contexts/UserContext';

const Downloads: React.FC = () => {
  const navigate = useNavigate();
  // USAMOS "circuits" del contexto, que ya viene traducido
  const { downloadedCircuits, removeDownload, simulateDownload, t, circuits } = useUser();

  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [needsUpdate, setNeedsUpdate] = useState<string[]>(['ruta-tabaco']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper para mostrar Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allItems = useMemo(() => {
    // 1. Mapear los circuitos traducidos (vienen del Context)
    const circuitItems = circuits.map(c => ({
      id: c.id,
      title: c.title,
      size: c.downloadSize,
      description: `Ver ${c.version}`, // Simplificado para evitar líos de traducción en el número
      image: c.image,
      type: 'circuit' as const,
      icon: 'map'
    }));

    // 2. Mapear los extras (vienen de constantes) pero traducir sus títulos al vuelo
    const extraItems = AVAILABLE_DOWNLOADS.map(e => {
      // Lógica de traducción para items extra basada en ID
      let localizedTitle = e.title;
      let localizedDesc = e.description;

      if (e.id === 'chicoana-map-pack') {
        localizedTitle = t('downloads.extras.map_pack');
        localizedDesc = t('downloads.extras.map_pack_desc');
      } else if (e.id === 'audio-pack-es') {
        localizedTitle = t('downloads.extras.audio_pack');
        localizedDesc = t('downloads.extras.audio_pack_desc');
      } else if (e.id === 'tamales-fest') {
        localizedTitle = t('downloads.extras.tamal_guide');
        localizedDesc = t('downloads.extras.tamal_guide_desc');
      } else if (e.id === 'trekking-maps') {
        localizedTitle = t('downloads.extras.trekking');
        localizedDesc = t('downloads.extras.trekking_desc');
      }

      return {
        id: e.id,
        title: localizedTitle,
        size: e.size,
        description: localizedDesc,
        image: null,
        type: 'extra' as const,
        icon: e.icon
      };
    });

    return [...circuitItems, ...extraItems];
  }, [circuits, t]); // Dependencia clave: circuits y t

  // Filtrado directo basado en el estado del contexto
  const downloadedItems = allItems.filter(item => downloadedCircuits.includes(item.id));
  const availableItems = allItems.filter(item => !downloadedCircuits.includes(item.id));

  const handleDownload = async (id: string) => {
    setLoadingItems(prev => [...prev, id]);
    await simulateDownload(id);
    setLoadingItems(prev => prev.filter(i => i !== id));
    showToast('¡Descarga completada!');
  };

  const handleUpdate = async (id: string) => {
    setLoadingItems(prev => [...prev, id]);
    await simulateDownload(id);
    setLoadingItems(prev => prev.filter(i => i !== id));
    setNeedsUpdate(prev => prev.filter(i => i !== id));
    showToast('Actualizado correctamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar esta descarga del dispositivo?')) {
      removeDownload(id);
      setNeedsUpdate(prev => prev.filter(i => i !== id));
      showToast('Elemento eliminado');
    }
  };

  const handleOpen = (item: typeof allItems[0]) => {
    if (item.type === 'circuit') {
      navigate(`/circuit/${item.id}`);
    } else {
      // Manejo de Extras
      if (item.id === 'chicoana-map-pack' || item.id === 'trekking-maps') {
        navigate('/map');
      } else if (item.id === 'audio-pack-es') {
        showToast('Paquete de voces activo 🎧');
      } else {
        showToast(`Abriendo ${item.title}...`);
      }
    }
  };

  return (
    <div className="px-5 pt-8 min-h-screen bg-gray-50 dark:bg-background-dark pb-24 font-display transition-colors duration-300 relative">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs font-bold px-4 py-2 rounded-full shadow-xl z-50 animate-fade-in-up flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pt-safe-top">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('downloads.title')}</h1>
        <button onClick={() => navigate('/settings')} className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
          {t('nav.settings')}
        </button>
      </div>

      {/* STORAGE USAGE CARD */}
      <div className="mb-8">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t('downloads.storage')}</h2>
        <div className="bg-white dark:bg-surface-dark p-5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {(downloadedItems.length * 0.15 + 0.5).toFixed(1)} GB
            </h3>
            <span className="text-xs font-bold text-primary-dark dark:text-primary">45 GB {t('downloads.free_space')}</span>
          </div>
          <p className="text-[10px] font-medium text-gray-400 mb-3">{t('downloads.used_by')}</p>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex mb-2">
            <div className="h-full bg-[#80ec13] rounded-full transition-all duration-500" style={{ width: `${(downloadedItems.length * 5) + 10}%` }}></div>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-gray-300">
            <span>0 GB</span>
            <span>128 GB</span>
          </div>
        </div>
      </div>

      {/* --- DOWNLOADED ITEMS SECTION --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('downloads.downloaded')}</h2>
        <span className="bg-[#e0fec0] text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
          {downloadedItems.length} items
        </span>
      </div>

      <div className="space-y-6 mb-8">
        {downloadedItems.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">cloud_off</span>
            <p className="text-sm text-gray-400">{t('downloads.empty')}</p>
          </div>
        ) : (
          downloadedItems.map(item => {
            const isUpdating = loadingItems.includes(item.id);
            const updateAvailable = needsUpdate.includes(item.id);

            return (
              <div key={item.id} className="bg-white dark:bg-surface-dark p-3 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up">

                {/* Si es un circuito con imagen */}
                {item.type === 'circuit' && item.image ? (
                  <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 group bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    {updateAvailable && !isUpdating && (
                      <div className="absolute top-3 right-3 bg-[#fcefb4] text-orange-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-xs">update</span> {t('downloads.version_update')} v1.2
                      </div>
                    )}
                  </div>
                ) : (
                  // Si es un "Extra" sin imagen grande
                  <div className="flex items-center gap-4 p-2 mb-2">
                    <div className="w-12 h-12 bg-[#f0f9ff] dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    {updateAvailable && (
                      <div className="bg-[#fcefb4] text-orange-800 text-[10px] font-bold px-2 py-1 rounded-lg ml-auto">
                        {t('downloads.version_update')}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="px-1 pb-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">{item.title}</h3>
                    {!isUpdating && !updateAvailable && (
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-gray-400 mb-4">{item.size} • {item.description}</p>

                  {/* Action Buttons Row */}
                  <div className="flex gap-2">
                    {/* Main Action Button */}
                    {updateAvailable ? (
                      <button
                        onClick={() => handleUpdate(item.id)}
                        disabled={isUpdating}
                        className="flex-1 bg-[#141811] dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.98] transition-all text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                      >
                        {isUpdating ? (
                          <>
                            <span className="material-symbols-outlined text-lg animate-spin">sync</span> {t('downloads.updating')}
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-lg">sync</span> {t('downloads.update')}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpen(item)}
                        className="flex-1 bg-[#80ec13] hover:bg-[#72d611] active:scale-[0.98] transition-all text-black text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {(item.id === 'audio-pack-es') ? 'play_circle' : 'map'}
                        </span>
                        {t('downloads.open')}
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-10 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- AVAILABLE FOR DOWNLOAD SECTION --- */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('downloads.available')}</h2>

      <div className="space-y-3">
        {availableItems.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">¡Todo está descargado! 🎉</p>
        ) : (
          availableItems.map(item => {
            const isLoading = loadingItems.includes(item.id);
            return (
              <div key={item.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-[#f0f9ff] dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                    {item.type === 'circuit' && item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover rounded-xl opacity-80"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=200";
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined">{item.icon}</span>
                    )}
                  </div>
                  <div className="min-w-0 pr-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.size} • <span className="font-medium">{item.description}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(item.id)}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 shrink-0"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined">download</span>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default Downloads;


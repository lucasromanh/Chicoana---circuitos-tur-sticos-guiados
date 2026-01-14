
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const CircuitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // USAR circuitos localizados del contexto
  const { favorites, toggleFavorite, downloadedCircuits, simulateDownload, visitedPois, t, circuits } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);

  const circuit = circuits.find(c => c.id === id);

  if (!circuit) return <div className="p-8 text-center">Circuito no encontrado</div>;

  const isFav = favorites.includes(circuit.id);
  const isDownloaded = downloadedCircuits.includes(circuit.id);

  const handleDownload = async () => {
    if (isDownloaded) return;
    setIsDownloading(true);
    await simulateDownload(circuit.id);
    setIsDownloading(false);
  };

  const handleStartCircuit = async () => {
    if (!isDownloaded) {
      setIsDownloading(true);
      await simulateDownload(circuit.id);
      setIsDownloading(false);
    }

    if (circuit.pois && circuit.pois.length > 0) {
      navigate(`/poi/${circuit.pois[0].id}`);
    } else {
      navigate('/navigation', { state: { circuitId: circuit.id } });
    }
  };

  const handleOpenMap = () => {
    navigate('/navigation', { state: { circuitId: circuit.id } });
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-56">
      {/* Header Image */}
      <div className="relative h-72 bg-gray-200 dark:bg-gray-800">
        <img
          src={circuit.image}
          alt={circuit.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-light dark:to-background-dark"></div>

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center z-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            onClick={() => toggleFavorite(circuit.id)}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${isFav ? 'bg-red-500 text-white border-none' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
              }`}
          >
            <span className={`material-symbols-outlined ${isFav ? 'filled' : ''}`}>favorite</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="px-2 py-1 bg-primary text-black text-xs font-bold rounded uppercase mb-2 inline-block shadow-sm">
            {circuit.difficulty}
          </span>
          <h1 className="text-3xl font-bold text-text-main dark:text-white leading-tight mb-1">{circuit.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-200 font-medium">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">straighten</span> {circuit.distance} {t('circuit.distance')}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span> {circuit.duration} {t('circuit.duration')}</span>
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDownloaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              {isDownloading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">{isDownloaded ? 'check_circle' : 'cloud_download'}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-text-main dark:text-white">
                {isDownloaded ? t('circuit.available_offline') : isDownloading ? t('circuit.downloading') : t('circuit.download')}
              </p>
              <p className="text-xs text-gray-500">
                {isDownloaded ? t('circuit.ready') : `${circuit.downloadSize}`}
              </p>
            </div>
          </div>
          {!isDownloaded && !isDownloading && (
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-text-main dark:bg-white text-white dark:text-black text-xs font-bold rounded-full active:scale-95 transition-transform"
            >
              {t('circuit.download')}
            </button>
          )}
        </div>

        {/* POI Timeline */}
        <h2 className="text-lg font-bold mb-4 px-2 dark:text-white">{t('circuit.pois')}</h2>
        <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
          {circuit.pois && circuit.pois.length > 0 ? circuit.pois.map((poi, index) => {
            const isVisited = visitedPois.includes(poi.id);
            // Formatear distancia para soportar traducción
            const distDisplay = poi.distanceFromStart.includes('Inicio')
              ? `0.0 km (${t('circuit.start_point')})`
              : poi.distanceFromStart;

            return (
              <div
                key={poi.id}
                onClick={() => navigate(`/poi/${poi.id}`)}
                className={`relative flex gap-4 cursor-pointer group transition-all duration-300 ${isVisited ? 'opacity-60 grayscale-[0.8] hover:opacity-100 hover:grayscale-0' : ''}`}
              >
                {/* Timeline Node */}
                <div className={`relative z-10 w-7 h-7 rounded-full border-4 border-background-light dark:border-background-dark flex items-center justify-center shadow-sm shrink-0 transition-colors ${isVisited ? 'bg-green-500' : 'bg-primary'}`}>
                  {isVisited ? (
                    <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
                  ) : (
                    <span className="text-[10px] font-bold text-black">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform">
                  <div className="flex gap-3">
                    <img
                      src={poi.image}
                      alt={poi.title}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=200";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-text-main dark:text-white truncate pr-2">{poi.title}</h3>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{distDisplay}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{poi.description}</p>

                      <div className="flex items-center justify-between mt-2">
                        {poi.audioDuration && (
                          <div className="flex items-center gap-1 text-primary-dark dark:text-primary">
                            <span className="material-symbols-outlined text-sm">headphones</span>
                            <span className="text-[10px] font-bold">{t('circuit.audio_label')} • {poi.audioDuration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="pl-8 text-sm text-gray-500 italic">
              {t('circuit.offline_req')}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 w-full px-4 pt-4 pb-2 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-40">
        <div className="flex gap-3">
          <button
            onClick={handleOpenMap}
            className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined">map</span>
            {t('circuit.map')}
          </button>

          <button
            onClick={handleStartCircuit}
            className="flex-[2] bg-black text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">play_circle</span>
            {isDownloading ? t('circuit.downloading') : t('circuit.start_guided')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircuitDetail;


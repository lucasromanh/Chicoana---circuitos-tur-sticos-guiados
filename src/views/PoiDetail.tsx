

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';


const PoiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Usa "circuits" del contexto, que ya tiene los POIs traducidos
  const { markPoiAsVisited, toggleFavorite, favorites, downloadedCircuits, t, circuits } = useUser();

  // Find the circuit AND the specific POI logic from localized data
  const currentCircuit = circuits.find(c => c.pois.some(p => p.id === id));
  const poi = currentCircuit?.pois.find(p => p.id === id);

  // Logic for Next POI
  const currentIndex = currentCircuit?.pois.findIndex(p => p.id === id) ?? -1;
  const nextPoi = (currentCircuit && currentIndex >= 0 && currentIndex < currentCircuit.pois.length - 1)
    ? currentCircuit.pois[currentIndex + 1]
    : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false); // Estado para feedback visual
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Derive offline state based on circuit download
  const isOfflineReady = currentCircuit ? downloadedCircuits.includes(currentCircuit.id) : false;
  const isFav = currentCircuit ? favorites.includes(currentCircuit.id) : false;

  useEffect(() => {
    // Mark as visited when entering the detail view
    if (poi) {
      markPoiAsVisited(poi.id);
    }

    if (poi?.audioUrl) {
      audioRef.current = new Audio(poi.audioUrl);

      const updateProgress = () => {
        if (audioRef.current) {
          const duration = audioRef.current.duration || 1;
          const current = audioRef.current.currentTime;
          setProgress((current / duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [poi]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800";
  };

  // --- LÓGICA DE COMPARTIR MULTIPLATAFORMA ---
  const handleShare = async () => {
    if (!poi) return;

    const currentUrl = window.location.href;
    const shareData = {
      title: `Chicoana Turismo: ${poi.title}`,
      text: `Descubre ${poi.title} en Chicoana. ${poi.description?.substring(0, 100)}...`,
      url: currentUrl,
    };

    const doFallback = async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2500);
      } catch (e) {
        console.error('Fallback clipboard failed', e);
      }
    };

    try {
      // 1. Validar soporte de API nativa
      if (navigator.share) {
        // Validar datos si canShare está disponible (nivel extra de seguridad)
        if (navigator.canShare && !navigator.canShare(shareData)) {
          // Si falla validación completa, intentar solo URL y Título
          const simpleData = { title: shareData.title, url: shareData.url };
          if (navigator.canShare(simpleData)) {
            await navigator.share(simpleData);
            return;
          }
          throw new Error('Data not sharable');
        }

        // Intentar compartir
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err: any) {
      // 2. Manejo de Errores
      // Si el usuario cancela (AbortError), no hacemos nada
      if (err.name === 'AbortError') return;

      console.warn('Share falló, usando fallback:', err);
      // Para cualquier otro error (Invalid URL, NotAllowed, etc), usamos fallback
      await doFallback();
    }
  };

  if (!poi) return <div className="p-8">POI no encontrado</div>;

  return (
    <div className="bg-white dark:bg-background-dark min-h-screen pb-32 relative">

      {/* Toast Notification para Copiar (Fallback) */}
      {showShareToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-3 animate-fade-in-up backdrop-blur-md">
          <span className="material-symbols-outlined text-green-400">link</span>
          <span className="text-xs font-bold">¡Enlace copiado al portapapeles!</span>
        </div>
      )}

      {/* 1. Header Image & Nav */}
      <div className="relative h-72 bg-gray-200 dark:bg-gray-800">
        <img
          src={poi.image}
          alt={poi.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />

        <div className="absolute top-0 left-0 w-full p-4 pt-safe-top flex justify-between items-center z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          {/* BOTÓN COMPARTIR CONECTADO */}
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
      </div>

      <div className="px-5 py-6 bg-white dark:bg-background-dark rounded-t-[2rem] -mt-6 relative z-10">

        {/* 2. Title & Visit Badge */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white leading-tight flex-1 mr-4">
            {poi.title}
          </h1>
          <div className="bg-[#d4fca4] dark:bg-primary/20 flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0">
            <span className="material-symbols-outlined text-primary-dark dark:text-primary text-2xl">church</span>
            <span className="text-[8px] font-bold text-primary-dark dark:text-primary uppercase mt-0.5">{t('poi.visit')}</span>
          </div>
        </div>

        {/* 3. Metadata Row */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
          <span className="material-symbols-outlined text-sm">history</span>
          <span>{t('poi.founded')} 1878</span>
          <span>•</span>
          <span>5 {t('poi.read')}</span>
        </div>

        {/* 4. Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {poi.description}
        </p>

        {/* 5. Audio Guide Card */}
        {poi.audioUrl && (
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-4">
            <button
              onClick={togglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-black shadow-md transition-transform active:scale-95 shrink-0 ${isPlaying ? 'bg-primary' : 'bg-primary'}`}
            >
              <span className="material-symbols-outlined text-2xl filled">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-primary-dark dark:text-primary uppercase mb-0.5">{t('poi.audio_guide')}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{t('poi.audio_title')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-gray-400 font-mono">0:00</span>
                <div className="h-1 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{poi.audioDuration || '2:15'}</span>
              </div>
            </div>
            <button className="text-gray-400">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        )}

        {/* 6. Action Buttons Row (Guardar / Como llegar) */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => currentCircuit && toggleFavorite(currentCircuit.id)}
            className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 py-3.5 rounded-xl flex items-center justify-center gap-2 text-gray-800 dark:text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all"
          >
            <span className={`material-symbols-outlined ${isFav ? 'text-red-500 filled' : ''}`}>favorite</span>
            {isFav ? t('poi.saved') : t('poi.save')}
          </button>
          <button
            onClick={() => navigate('/navigation', { state: { circuitId: currentCircuit?.id } })}
            className="flex-[1.5] bg-primary hover:bg-primary-dark text-black py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined filled">near_me</span>
            {t('poi.directions')}
          </button>
        </div>

        {/* 7. Gallery Section (Imágenes adicionales) */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 px-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-dark dark:text-primary">photo_library</span>
            {t('poi.gallery')}
          </h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 snap-x">
            {/* Image 1: POI Image */}
            <img src={poi.image} className="w-48 h-32 object-cover rounded-2xl shrink-0 snap-start shadow-sm bg-gray-100" alt="Vista Principal" onError={handleImageError} />

            {/* Image 2: Video Thumbnail (if avail) or fallback logic to avoid broken image */}
            <img
              src={poi.videoThumbnail || poi.image}
              className="w-48 h-32 object-cover rounded-2xl shrink-0 snap-start shadow-sm bg-gray-100"
              alt="Detalle"
              onError={handleImageError}
            />

            {/* Image 3: General Fallback */}
            <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=400" className="w-48 h-32 object-cover rounded-2xl shrink-0 snap-start shadow-sm bg-gray-100" alt="Ambiente" onError={handleImageError} />
          </div>
        </div>

        {/* 8. Video Section (Offline Ready) */}
        {poi.videoThumbnail && (
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-dark dark:text-primary">videocam</span>
              {t('poi.video')}
            </h3>
            <div
              onClick={handleVideoPlay}
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-gray-100 dark:bg-gray-800"
            >
              <img src={poi.videoThumbnail} alt="Video Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={handleImageError} />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

              {/* Offline Badge */}
              {isOfflineReady && (
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">cloud_download</span>
                  {t('poi.offline_ready')}
                </div>
              )}

              {/* Play Button Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-black text-2xl ml-0.5 filled">play_arrow</span>
                </div>
              </div>

              {/* Duration Label */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                1:20
              </div>

              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs font-bold">Tour Virtual 360°</p>
              </div>

              {/* Real Video Player Overlay */}
              {isVideoPlaying && poi.videoUrl && (
                <div className="absolute inset-0 bg-black z-50 flex items-center justify-center animate-fade-in-up">
                  <video
                    src={poi.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(false); }}
                    className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 backdrop-blur-md hover:bg-black/70 transition-colors z-50"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 9. Next POI Floating Button */}
      <div className="fixed bottom-20 left-0 w-full px-4 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          {nextPoi ? (
            <button
              onClick={() => navigate(`/poi/${nextPoi.id}`)}
              className="w-full bg-[#141811] dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-between px-5 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-0.5">{t('poi.next')}</p>
                  <p className="text-sm font-bold truncate max-w-[180px]">{nextPoi.title}</p>
                </div>
              </div>
              <div className="bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-md">
                2 min
              </div>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/circuit/${currentCircuit?.id}`)}
              className="w-full bg-primary text-black py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined filled">flag</span>
              {t('poi.finish')}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default PoiDetail;



import React, { useState, useMemo } from 'react';
import { useNavigate } from '@/navigation/routerAdapter';
import { AVATARS } from '@/constants';
import { useUser } from '@/contexts/UserContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  // USAMOS "circuits" del contexto, que ya viene traducido
  const { userName, isProfileComplete, userAvatarId, favorites, toggleFavorite, downloadedCircuits, t, circuits } = useUser();

  // States for functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive Avatar
  const currentAvatar = AVATARS.find(a => a.id === userAvatarId) || AVATARS[0];

  // Filtering Logic
  const filteredCircuits = useMemo(() => {
    return circuits.filter(circuit => {
      const matchesSearch = circuit.title.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = true;
      if (selectedCategory === 'Todos') {
        matchesCategory = true;
      } else if (selectedCategory === 'Favoritos') {
        matchesCategory = favorites.includes(circuit.id);
      } else {
        // Warning: This simple check assumes category names in CONSTANTS match the translation keys or values.
        // For robustness, we are filtering by raw category value from constants.ts 
        // Display name will be translated in the button.
        matchesCategory = circuit.category === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, favorites, circuits]);

  // Dynamic Title Logic
  const getSectionTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;

    switch (selectedCategory) {
      case 'Todos': return t('home.featured');
      case 'Favoritos': return t('home.favorites');
      case 'Históricos': return t('home.cats.hist');
      case 'Naturaleza': return t('home.cats.nat');
      case 'Gastronomía': return t('home.cats.gastro');
      case 'Cultura': return t('home.cats.cult');
      default: return selectedCategory;
    }
  };

  const categories = [
    { id: 'Todos', label: t('home.cats.all') },
    { id: 'Favoritos', label: t('home.cats.fav') },
    { id: 'Históricos', label: t('home.cats.hist') },
    { id: 'Naturaleza', label: t('home.cats.nat') },
    { id: 'Gastronomía', label: t('home.cats.gastro') },
    { id: 'Cultura', label: t('home.cats.cult') }
  ];

  return (
    <div className="px-4 pt-12 pb-20 relative">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${currentAvatar.bg} overflow-hidden border border-white shadow-sm flex items-center justify-center text-xl`}>
              {currentAvatar.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('home.welcome')}</p>
              <h2 className="text-lg font-bold text-text-main dark:text-white leading-none">
                {isProfileComplete ? `${t('home.hello')}, ${userName}` : `${t('home.hello')}, ${t('home.traveler')}`}
              </h2>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl text-black dark:text-white">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Notifications Dropdown (Simulated) */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 p-2 animate-fade-in-up">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">{t('home.notif_title')}</p>
                <div className="flex gap-2 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm">event</span>
                  <div>
                    <p className="text-xs font-bold dark:text-white">{t('home.notif_event')}</p>
                    <p className="text-[10px] text-gray-500">{t('home.notif_desc')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.search')}
            className="w-full bg-white dark:bg-surface-dark py-3 pl-10 pr-12 rounded-2xl text-sm shadow-sm border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white dark:placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-xl shadow-sm text-black">
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>
      </header>

      {/* Categories - Grid Layout (2 Rows) */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-2.5 rounded-xl text-[11px] font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1 ${selectedCategory === cat.id
                ? 'bg-text-main text-white shadow-black/10 scale-[1.02]'
                : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
          >
            {cat.id === 'Favoritos' && (
              <span className={`material-symbols-outlined text-[14px] ${selectedCategory === cat.id ? 'text-red-500 filled' : 'text-red-500'}`}>favorite</span>
            )}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-display font-bold dark:text-white animate-fade-in-up" key={selectedCategory}>
          {getSectionTitle()}
        </h2>
        {!searchQuery && selectedCategory === 'Todos' && <button className="text-xs font-bold text-primary-dark dark:text-primary">{t('home.view_all')}</button>}
      </div>

      {/* Circuit List */}
      <div className="grid gap-6">
        {filteredCircuits.length > 0 ? (
          filteredCircuits.map((circuit) => {
            const isFav = favorites.includes(circuit.id);
            const isDownloaded = downloadedCircuits.includes(circuit.id);

            return (
              <div
                key={circuit.id}
                onClick={() => navigate(`/circuit/${circuit.id}`)}
                className="group bg-white dark:bg-surface-dark rounded-[2rem] p-3 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all duration-300"
              >
                <div className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={circuit.image}
                    alt={circuit.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800";
                    }}
                  />

                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(circuit.id);
                      }}
                      className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${isFav ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
                        }`}
                    >
                      <span className={`material-symbols-outlined text-lg ${isFav ? 'filled' : ''}`}>favorite</span>
                    </button>
                  </div>

                  {isDownloaded && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 animate-fade-in-up">
                      <span className="material-symbols-outlined text-[10px] text-primary">check_circle</span>
                      Offline
                    </div>
                  )}
                </div>

                <div className="px-1">
                  <h3 className="font-bold text-lg text-text-main dark:text-white leading-tight mb-1">{circuit.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">hiking</span> {circuit.distance} {t('circuit.distance')}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {circuit.duration} {t('circuit.duration')}</span>
                  </div>

                  <button className="w-full py-3 bg-[#e8fcc2] dark:bg-primary/20 text-text-main dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 group-hover:bg-primary transition-colors">
                    {t('circuit.details')}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400 flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
              {selectedCategory === 'Favoritos' ? 'heart_broken' : 'search_off'}
            </span>
            <p className="text-sm">
              {selectedCategory === 'Favoritos'
                ? t('home.favorites') + ' ' + t('home.no_results')
                : t('home.no_results')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


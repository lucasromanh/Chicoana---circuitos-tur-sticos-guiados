import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CIRCUITS, AVATARS } from '../constants';
import { useUser } from '../contexts/UserContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userName, isProfileComplete, userAvatarId, favorites, toggleFavorite } = useUser();
  
  // States for functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive Avatar
  const currentAvatar = AVATARS.find(a => a.id === userAvatarId) || AVATARS[0];

  // Filtering Logic
  const filteredCircuits = useMemo(() => {
    return CIRCUITS.filter(circuit => {
      const matchesSearch = circuit.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'Todos') {
        matchesCategory = true;
      } else if (selectedCategory === 'Favoritos') {
        matchesCategory = favorites.includes(circuit.id);
      } else {
        matchesCategory = circuit.category === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, favorites]);

  // Se agregan más categorías para forzar el scroll y se incluye 'Favoritos'
  const categories = ['Todos', 'Favoritos', 'Históricos', 'Naturaleza', 'Gastronomía', 'Cultura'];

  return (
    <div className="px-4 pt-12 pb-20 relative">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${currentAvatar.bg} overflow-hidden border border-white shadow-sm flex items-center justify-center text-xl`}>
               {currentAvatar.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bienvenido</p>
              <h2 className="text-lg font-bold text-text-main dark:text-white leading-none">
                {isProfileComplete ? `Hola, ${userName}` : 'Hola, Viajero'}
              </h2>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {/* Notifications Dropdown (Simulated) */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 p-2 animate-fade-in-up">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Notificaciones</p>
                <div className="flex gap-2 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm">event</span>
                  <div>
                    <p className="text-xs font-bold dark:text-white">Festival del Tamal</p>
                    <p className="text-[10px] text-gray-500">Este fin de semana en la plaza.</p>
                  </div>
                </div>
                <div className="flex gap-2 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">
                  <span className="material-symbols-outlined text-blue-500 text-sm">cloud</span>
                  <div>
                    <p className="text-xs font-bold dark:text-white">Clima ideal</p>
                    <p className="text-[10px] text-gray-500">Mañana soleado en la Quebrada.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TUTORIAL / ONBOARDING STEP 1 */}
        {!isProfileComplete && (
          <div 
            onClick={() => navigate('/settings')}
            className="mb-6 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all animate-fade-in-up"
          >
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-black">edit</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Configura tu perfil</h3>
                <p className="text-xs text-gray-600 leading-tight">Agrega tu nombre para personalizar la guía.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary-dark">arrow_forward</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar circuitos en Chicoana..." 
            className="w-full bg-white dark:bg-surface-dark py-3 pl-10 pr-12 rounded-2xl text-sm shadow-sm border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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

      {/* Categories - Scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar touch-pan-x snap-x snap-mandatory">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`snap-start px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex-shrink-0 flex items-center gap-1 ${
              selectedCategory === cat 
              ? 'bg-text-main text-white shadow-black/10 scale-105' 
              : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {cat === 'Favoritos' && (
              <span className={`material-symbols-outlined text-sm ${selectedCategory === cat ? 'text-red-500 filled' : 'text-red-500'}`}>favorite</span>
            )}
            {cat}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-display font-bold dark:text-white">
          {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory === 'Favoritos' ? 'Tus Favoritos' : 'Circuitos destacados'}
        </h2>
        {!searchQuery && selectedCategory !== 'Favoritos' && <button className="text-xs font-bold text-primary-dark dark:text-primary">Ver todos</button>}
      </div>

      {/* Circuit List */}
      <div className="grid gap-6">
        {filteredCircuits.length > 0 ? (
          filteredCircuits.map((circuit) => {
            const isFav = favorites.includes(circuit.id);
            return (
              <div 
                key={circuit.id}
                onClick={() => navigate(`/circuit/${circuit.id}`)}
                className="group bg-white dark:bg-surface-dark rounded-[2rem] p-3 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all duration-300"
              >
                <div className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden mb-3">
                  <img src={circuit.image} alt={circuit.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(circuit.id);
                      }}
                      className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${
                        isFav ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg ${isFav ? 'filled' : ''}`}>favorite</span>
                    </button>
                  </div>
                  
                  {circuit.isDownloaded && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-primary">check_circle</span>
                        Offline
                    </div>
                  )}
                </div>
                
                <div className="px-1">
                  <h3 className="font-bold text-lg text-text-main dark:text-white leading-tight mb-1">{circuit.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">hiking</span> {circuit.distance}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {circuit.duration}</span>
                    <span className="flex items-center gap-1 text-primary-dark"><span className="material-symbols-outlined text-sm">category</span> {circuit.category}</span>
                  </div>
                  
                  <button className="w-full py-3 bg-[#e8fcc2] dark:bg-primary/20 text-text-main dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 group-hover:bg-primary transition-colors">
                    Ver detalles 
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
                ? 'Aún no tienes favoritos guardados.' 
                : 'No se encontraron circuitos.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
import React from 'react';
import { useUser } from '../contexts/UserContext';
import { AVATARS } from '../constants';

const Settings: React.FC = () => {
  const { userName, setUserName, userAvatarId, setUserAvatarId } = useUser();

  const currentAvatar = AVATARS.find(a => a.id === userAvatarId) || AVATARS[0];

  return (
    <div className="px-4 pt-12 min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <h1 className="text-2xl font-display font-bold mb-6 dark:text-white">Ajustes</h1>

      <div className="space-y-6">
         
         {/* SECCIÓN PERFIL */}
         <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2 flex items-center gap-2">
               Perfil
               {!userName && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
               
               {/* Avatar Selection */}
               <div className="flex flex-col items-center mb-6">
                  <div className={`w-20 h-20 rounded-full ${currentAvatar.bg} flex items-center justify-center text-4xl mb-4 shadow-sm border-4 border-white dark:border-gray-700`}>
                     {currentAvatar.icon}
                  </div>
                  <p className="text-xs text-gray-400 mb-3 uppercase font-bold">Elige tu personaje</p>
                  <div className="flex gap-3 justify-center">
                    {AVATARS.map((avatar) => (
                      <button 
                        key={avatar.id}
                        onClick={() => setUserAvatarId(avatar.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform active:scale-95 ${avatar.bg} ${userAvatarId === avatar.id ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900 scale-110' : 'opacity-70 grayscale'}`}
                        title={avatar.label}
                      >
                        {avatar.icon}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-6"></div>

               <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tu Nombre</label>
                     <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ej: Julián"
                        className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent focus:border-primary outline-none py-2 px-3 rounded-lg font-bold text-text-main dark:text-white placeholder-gray-300 transition-colors"
                     />
                  </div>
               </div>
               <p className="text-xs text-gray-400 leading-relaxed text-center mt-2">
                  ¡Hola {userName || 'Viajero'}! Representarás a Chicoana como un {currentAvatar.label}.
               </p>
            </div>
         </section>

         {/* Preferences Section */}
         <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Preferencias</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-gray-500">dark_mode</span>
                     <span className="text-sm font-medium dark:text-white">Tema Oscuro</span>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 dark:bg-primary rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-gray-500">translate</span>
                     <span className="text-sm font-medium dark:text-white">Idioma</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Español (AR)</span>
               </div>
            </div>
         </section>

         {/* Navigation Settings */}
         <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Navegación & GPS</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-gray-500">volume_up</span>
                     <span className="text-sm font-medium dark:text-white">Instrucciones de voz</span>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-gray-500">near_me</span>
                     <span className="text-sm font-medium dark:text-white">Precisión GPS en segundo plano</span>
                  </div>
                  <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
               </div>
            </div>
         </section>

         {/* Support */}
         <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Soporte</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                  <span className="text-sm font-medium dark:text-white">Tutorial de inicio</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
               </div>
               <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                  <span className="text-sm font-medium dark:text-white">Términos y Privacidad</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
               </div>
            </div>
         </section>
         
         <div className="text-center pt-4">
            <p className="text-xs text-gray-400">Chicoana Turismo v1.0.0 (Build 2024.1)</p>
         </div>
      </div>
    </div>
  );
};

export default Settings;
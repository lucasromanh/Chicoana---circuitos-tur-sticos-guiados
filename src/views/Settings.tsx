

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { AVATARS } from '@/constants';
import { LANGUAGES } from '@/translations';
import { LanguageCode } from '@/types';


// Modal Component helper
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up" onClick={onClose}>
         <div className="bg-white dark:bg-surface-dark w-full sm:w-[90%] sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
               <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
               </button>
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
               {children}
            </div>
         </div>
      </div>
   );
};

const Settings: React.FC = () => {
   const navigate = useNavigate();
   const {
      userName, setUserName, userAvatarId, setUserAvatarId,
      settings, updateSetting, resetTutorial, t
   } = useUser();

   const [activeModal, setActiveModal] = useState<'help' | 'about' | 'terms' | 'language' | null>(null);

   const currentAvatar = AVATARS.find(a => a.id === userAvatarId) || AVATARS[0];
   const currentLang = LANGUAGES.find(l => l.code === settings.language) || LANGUAGES[0];

   const handleTutorialReset = () => {
      if (window.confirm("¿Deseas reiniciar el tutorial de inicio?")) {
         resetTutorial();
         navigate('/');
      }
   };

   const ToggleSwitch = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
      <div
         onClick={onChange}
         className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${active ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${active ? 'left-[26px]' : 'left-1'}`}></div>
      </div>
   );

   return (
      <div className="px-4 pt-12 min-h-screen bg-background-light dark:bg-background-dark pb-24 transition-colors duration-300">
         <h1 className="text-2xl font-display font-bold mb-6 dark:text-white">{t('settings.title')}</h1>

         <div className="space-y-6">

            {/* SECCIÓN PERFIL */}
            <section>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                  {t('settings.profile')}
                  {!userName && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
               </h3>
               <div className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-5 shadow-sm border border-gray-100 dark:border-gray-800">

                  {/* Avatar Selection */}
                  <div className="flex flex-col items-center mb-6">
                     <div className={`w-20 h-20 rounded-full ${currentAvatar.bg} flex items-center justify-center text-4xl mb-4 shadow-sm border-4 border-white dark:border-gray-700`}>
                        {currentAvatar.icon}
                     </div>
                     <p className="text-xs text-gray-400 mb-3 uppercase font-bold">{t('settings.choose_avatar')}</p>
                     <div className="flex gap-3 justify-center">
                        {AVATARS.map((avatar) => (
                           <button
                              key={avatar.id}
                              onClick={() => setUserAvatarId(avatar.id)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform active:scale-95 ${avatar.bg} ${userAvatarId === avatar.id ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface-dark scale-110' : 'opacity-70 grayscale'}`}
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
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{t('settings.your_name')}</label>
                        <input
                           type="text"
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                           placeholder="Ej: Julián"
                           className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent focus:border-primary outline-none py-2 px-3 rounded-lg font-bold text-text-main dark:text-white placeholder-gray-300 transition-colors"
                        />
                     </div>
                  </div>
               </div>
            </section>

            {/* SECCIÓN DATOS OFFLINE */}
            <section>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.offline_data')}</h3>
               <div className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                     <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-500">wifi</span>
                     </div>
                     <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{t('settings.wifi_only')}</h4>
                     </div>
                  </div>
                  <div className="shrink-0">
                     <ToggleSwitch
                        active={settings.wifiOnly}
                        onChange={() => updateSetting('wifiOnly', !settings.wifiOnly)}
                     />
                  </div>
               </div>
            </section>

            {/* Preferences Section */}
            <section>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.preferences')}</h3>
               <div className="bg-white dark:bg-surface-dark rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-700">

                  {/* Dark Mode */}
                  <div className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">dark_mode</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.dark_mode')}</span>
                     </div>
                     <ToggleSwitch
                        active={settings.darkMode}
                        onChange={() => updateSetting('darkMode', !settings.darkMode)}
                     />
                  </div>

                  {/* Language */}
                  <button
                     onClick={() => setActiveModal('language')}
                     className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">translate</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.language')}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xl">{currentLang.flag}</span>
                        <span className="text-xs font-bold text-gray-500">{currentLang.label}</span>
                        <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                     </div>
                  </button>
               </div>
            </section>

            {/* Navigation Settings */}
            <section>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.nav_gps')}</h3>
               <div className="bg-white dark:bg-surface-dark rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-700">

                  {/* Voice */}
                  <div className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">volume_up</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.voice')}</span>
                     </div>
                     <ToggleSwitch
                        active={settings.voiceInstructions}
                        onChange={() => updateSetting('voiceInstructions', !settings.voiceInstructions)}
                     />
                  </div>

                  {/* GPS */}
                  <div className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">near_me</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.gps_accuracy')}</span>
                     </div>
                     <ToggleSwitch
                        active={settings.backgroundGps}
                        onChange={() => updateSetting('backgroundGps', !settings.backgroundGps)}
                     />
                  </div>
               </div>
            </section>

            {/* Support */}
            <section>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.support')}</h3>
               <div className="bg-white dark:bg-surface-dark rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-700">

                  {/* Ayuda */}
                  <button
                     onClick={() => setActiveModal('help')}
                     className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">help</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.help')}</span>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                  </button>

                  {/* Acerca de */}
                  <button
                     onClick={() => setActiveModal('about')}
                     className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">info</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.about')} Chicoana Turismo</span>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                  </button>

                  {/* Terms */}
                  <button
                     onClick={() => setActiveModal('terms')}
                     className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">gavel</span>
                        <span className="text-sm font-medium dark:text-white">{t('settings.terms')}</span>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward_ios</span>
                  </button>
               </div>
            </section>

            <div className="text-center pt-4">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Chicoana Turismo v1.0.0</p>
            </div>
         </div>

         {/* --- MODALS --- */}

         {/* Language Modal */}
         <Modal isOpen={activeModal === 'language'} onClose={() => setActiveModal(null)} title={t('settings.language')}>
            <div className="grid grid-cols-1 gap-2">
               {LANGUAGES.map(lang => (
                  <button
                     key={lang.code}
                     onClick={() => {
                        updateSetting('language', lang.code);
                        setActiveModal(null);
                     }}
                     className={`flex items-center p-3 rounded-xl border transition-all ${settings.language === lang.code ? 'bg-primary/20 border-primary' : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     <span className="text-2xl mr-3">{lang.flag}</span>
                     <span className={`flex-1 text-left font-bold ${settings.language === lang.code ? 'text-primary-dark dark:text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                        {lang.label}
                     </span>
                     {settings.language === lang.code && <span className="material-symbols-outlined text-primary-dark dark:text-primary">check_circle</span>}
                  </button>
               ))}
            </div>
         </Modal>

         {/* Help Modal */}
         <Modal isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)} title={t('settings.help')}>
            <div className="space-y-4">
               <p>Si tienes emergencias o necesitas asistencia turística, comunícate con:</p>
               <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined text-lg">call</span>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-500">Atención al Turista (Muni)</p>
                        <a href="tel:03874907000" className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">0387-490-7000</a>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-lg">local_police</span>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-500">Policía Chicoana</p>
                        <a href="tel:911" className="text-lg font-bold text-gray-900 dark:text-white hover:text-red-500 transition-colors">911</a>
                     </div>
                  </div>
               </div>
               <p className="text-xs italic text-gray-400">La atención presencial es en la oficina de turismo frente a la Plaza Principal, de Lunes a Domingo de 8:00 a 20:00 hs.</p>
            </div>
         </Modal>

         {/* About Modal */}
         <Modal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title={t('settings.about')}>
            <div className="flex flex-col items-center mb-6">
               <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-4 shadow-[0_10px_30px_rgba(128,236,19,0.3)] rotate-3">
                  <span className="material-symbols-outlined text-black text-4xl">landscape</span>
               </div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">Chicoana Turismo</h3>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Guía Oficial Offline</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-4">
               <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Desarrollado por</h4>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                     <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                     <p className="text-base font-bold text-gray-900 dark:text-white">Lucas Roman</p>
                     <p className="text-xs text-gray-500">Salta Capital, Argentina</p>
                  </div>
               </div>
            </div>
            <p className="text-center text-xs text-gray-400">
               Hecho con ❤️ para promover el turismo en nuestros hermosos valles.
            </p>
         </Modal>

         {/* Terms Modal */}
         <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title={t('settings.terms')}>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">1. Uso de Datos</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                     Esta aplicación recopila datos de ubicación únicamente para proporcionar servicios de navegación y alertas de proximidad mientras usas la app. Ningún dato personal es compartido con terceros.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">2. Contenido Offline</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                     Los mapas y guías descargados se almacenan localmente en tu dispositivo. Puedes eliminarlos en cualquier momento desde la sección "Gestión Offline".
                  </p>
               </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold mt-4">
               Entendido
            </button>
         </Modal>

      </div>
   );
};

export default Settings;


import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal as RNModal, Alert, Switch, Linking } from 'react-native';
import { useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { AVATARS } from '@/constants';
import { LANGUAGES } from '@/translations';
import { MaterialIcons } from '@expo/vector-icons';

// Modal Component helper
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
   return (
      <RNModal
         visible={isOpen}
         transparent={true}
         animationType="fade"
         onRequestClose={onClose}
         statusBarTranslucent
      >
         <View className="flex-1 justify-end sm:justify-center bg-black/50" onStartShouldSetResponder={() => { onClose(); return true; }}>
            <View
               className="bg-white dark:bg-zinc-900 w-full sm:w-[90%] sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[85%] overflow-hidden"
               onStartShouldSetResponder={(e) => { e.stopPropagation(); return true; }}
            >
               <View className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden" />
               <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
                  <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                     <MaterialIcons name="close" size={20} color="gray" />
                  </TouchableOpacity>
               </View>
               <ScrollView className="text-gray-600 dark:text-gray-300">
                  {children}
               </ScrollView>
            </View>
         </View>
      </RNModal>
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
      Alert.alert(
         "Reiniciar Tutorial",
         "¿Deseas reiniciar el tutorial de inicio?",
         [
            { text: "Cancelar", style: "cancel" },
            {
               text: "Reiniciar",
               onPress: () => {
                  resetTutorial();
                  navigate('/');
               }
            }
         ]
      );
   };

   const ToggleSwitch = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
      <TouchableOpacity
         onPress={onChange}
         className={`w-12 h-7 rounded-full justify-center ${active ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
         <View className={`w-5 h-5 bg-white rounded-full shadow-md absolute ${active ? 'right-1' : 'left-1'}`} />
      </TouchableOpacity>
   );

   return (
      <ScrollView className="flex-1 bg-gray-50 dark:bg-zinc-950" contentContainerStyle={{ paddingBottom: 100, paddingTop: 48, paddingHorizontal: 16 }}>
         <Text className="text-2xl font-bold mb-6 dark:text-white">{t('settings.title')}</Text>

         <View className="gap-6">

            {/* SECCIÓN PERFIL */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2 flex-row items-center gap-2">
                  {t('settings.profile')}
                  {!userName && <View className="w-2 h-2 rounded-full bg-primary" />}
               </Text>
               <View className="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-5 shadow-sm border border-gray-100 dark:border-gray-800">

                  {/* Avatar Selection */}
                  <View className="flex-col items-center mb-6">
                     <View className={`w-20 h-20 rounded-full ${currentAvatar.bg} items-center justify-center mb-4 shadow-sm border-4 border-white dark:border-gray-700`}>
                        <Text className="text-4xl">{currentAvatar.icon}</Text>
                     </View>
                     <Text className="text-xs text-gray-400 mb-3 uppercase font-bold">{t('settings.choose_avatar')}</Text>
                     <View className="flex-row gap-3 justify-center">
                        {AVATARS.map((avatar) => (
                           <TouchableOpacity
                              key={avatar.id}
                              onPress={() => setUserAvatarId(avatar.id)}
                              className={`w-10 h-10 rounded-full items-center justify-center ${avatar.bg} ${userAvatarId === avatar.id ? 'border-2 border-primary scale-110' : 'opacity-70'}`}
                           >
                              <Text className="text-xl">{avatar.icon}</Text>
                           </TouchableOpacity>
                        ))}
                     </View>
                  </View>

                  <View className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-6" />

                  <View className="flex-row items-center gap-4 mb-2">
                     <View className="flex-1">
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-1">{t('settings.your_name')}</Text>
                        <TextInput
                           value={userName}
                           onChangeText={setUserName}
                           placeholder="Ej: Julián"
                           placeholderTextColor="#9ca3af"
                           className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent focus:border-primary py-2 px-3 rounded-lg font-bold text-gray-900 dark:text-white"
                        />
                     </View>
                  </View>
               </View>
            </View>

            {/* SECCIÓN DATOS OFFLINE */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.offline_data')}</Text>
               <View className="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-row items-center justify-between gap-4">
                  <View className="flex-row items-center gap-3 flex-1">
                     <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center">
                        <MaterialIcons name="wifi" size={20} color="#3b82f6" />
                     </View>
                     <View>
                        <Text className="text-sm font-bold text-gray-900 dark:text-white" numberOfLines={1}>{t('settings.wifi_only')}</Text>
                     </View>
                  </View>
                  <ToggleSwitch
                     active={settings.wifiOnly}
                     onChange={() => updateSetting('wifiOnly', !settings.wifiOnly)}
                  />
               </View>
            </View>

            {/* Preferences Section */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.preferences')}</Text>
               <View className="bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">

                  {/* Dark Mode */}
                  <View className="p-4 flex-row items-center justify-between border-b border-gray-50 dark:border-gray-700">
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="dark-mode" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.dark_mode')}</Text>
                     </View>
                     <ToggleSwitch
                        active={settings.darkMode}
                        onChange={() => updateSetting('darkMode', !settings.darkMode)}
                     />
                  </View>

                  {/* Language */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('language')}
                     className="w-full p-4 flex-row items-center justify-between"
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="translate" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.language')}</Text>
                     </View>
                     <View className="flex-row items-center gap-2">
                        <Text className="text-xl">{currentLang.flag}</Text>
                        <Text className="text-xs font-bold text-gray-500">{currentLang.label}</Text>
                        <MaterialIcons name="arrow-forward-ios" size={14} color="#9ca3af" />
                     </View>
                  </TouchableOpacity>
               </View>
            </View>

            {/* Navigation Settings */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.nav_gps')}</Text>
               <View className="bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">

                  {/* Voice */}
                  <View className="p-4 flex-row items-center justify-between border-b border-gray-50 dark:border-gray-700">
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="volume-up" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.voice')}</Text>
                     </View>
                     <ToggleSwitch
                        active={settings.voiceInstructions}
                        onChange={() => updateSetting('voiceInstructions', !settings.voiceInstructions)}
                     />
                  </View>

                  {/* GPS */}
                  <View className="p-4 flex-row items-center justify-between">
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="near-me" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.gps_accuracy')}</Text>
                     </View>
                     <ToggleSwitch
                        active={settings.backgroundGps}
                        onChange={() => updateSetting('backgroundGps', !settings.backgroundGps)}
                     />
                  </View>
               </View>
            </View>

            {/* Support */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.support')}</Text>
               <View className="bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">

                  {/* Ayuda */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('help')}
                     className="w-full p-4 flex-row items-center justify-between border-b border-gray-50 dark:border-gray-700"
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="help" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.help')}</Text>
                     </View>
                     <MaterialIcons name="arrow-forward-ios" size={14} color="#9ca3af" />
                  </TouchableOpacity>

                  {/* Acerca de */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('about')}
                     className="w-full p-4 flex-row items-center justify-between border-b border-gray-50 dark:border-gray-700"
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="info" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.about')} Chicoana Turismo</Text>
                     </View>
                     <MaterialIcons name="arrow-forward-ios" size={14} color="#9ca3af" />
                  </TouchableOpacity>

                  {/* Terms */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('terms')}
                     className="w-full p-4 flex-row items-center justify-between"
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="gavel" size={20} color="gray" />
                        <Text className="text-sm font-medium dark:text-white">{t('settings.terms')}</Text>
                     </View>
                     <MaterialIcons name="arrow-forward-ios" size={14} color="#9ca3af" />
                  </TouchableOpacity>
               </View>
            </View>

            <View className="pt-4 items-center">
               <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Chicoana Turismo v1.0.0</Text>
            </View>
         </View>

         {/* --- MODALS --- */}

         {/* Language Modal */}
         <Modal isOpen={activeModal === 'language'} onClose={() => setActiveModal(null)} title={t('settings.language')}>
            <View className="gap-2">
               {LANGUAGES.map(lang => (
                  <TouchableOpacity
                     key={lang.code}
                     onPress={() => {
                        updateSetting('language', lang.code);
                        setActiveModal(null);
                     }}
                     className={`flex-row items-center p-3 rounded-xl border ${settings.language === lang.code ? 'bg-primary/20 border-primary' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}
                  >
                     <Text className="text-2xl mr-3">{lang.flag}</Text>
                     <Text className={`flex-1 text-left font-bold ${settings.language === lang.code ? 'text-primary-dark dark:text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                        {lang.label}
                     </Text>
                     {settings.language === lang.code && <MaterialIcons name="check-circle" size={20} color="black" />}
                  </TouchableOpacity>
               ))}
            </View>
         </Modal>

         {/* Help Modal */}
         <Modal isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)} title={t('settings.help')}>
            <View className="gap-4">
               <Text className="dark:text-white">Si tienes emergencias o necesitas asistencia turística, comunícate con:</Text>
               <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 gap-3">
                  <View className="flex-row items-center gap-3">
                     <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                        <MaterialIcons name="call" size={18} color="#2563eb" />
                     </View>
                     <View>
                        <Text className="text-xs font-bold text-gray-500">Atención al Turista (Muni)</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:03874907000')}>
                           <Text className="text-lg font-bold text-gray-900 dark:text-white">0387-490-7000</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
                  <View className="flex-row items-center gap-3">
                     <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                        <MaterialIcons name="local-police" size={18} color="#dc2626" />
                     </View>
                     <View>
                        <Text className="text-xs font-bold text-gray-500">Policía Chicoana</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:911')}>
                           <Text className="text-lg font-bold text-gray-900 dark:text-white">911</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
               <Text className="text-xs italic text-gray-400">La atención presencial es en la oficina de turismo frente a la Plaza Principal, de Lunes a Domingo de 8:00 a 20:00 hs.</Text>
            </View>
         </Modal>

         {/* About Modal */}
         <Modal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title={t('settings.about')}>
            <View className="items-center mb-6">
               <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center mb-4 shadow-sm rotate-3">
                  <MaterialIcons name="landscape" size={40} color="black" />
               </View>
               <Text className="text-2xl font-black text-gray-900 dark:text-white">Chicoana Turismo</Text>
               <Text className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Guía Oficial Offline</Text>
            </View>

            <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-4">
               <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Desarrollado por</Text>
               <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
                     <MaterialIcons name="person" size={24} color="gray" />
                  </View>
                  <View>
                     <Text className="text-base font-bold text-gray-900 dark:text-white">Lucas Roman</Text>
                     <Text className="text-xs text-gray-500">Salta Capital, Argentina</Text>
                  </View>
               </View>
            </View>
            <Text className="text-center text-xs text-gray-400">
               Hecho con ❤️ para promover el turismo en nuestros hermosos valles.
            </Text>
         </Modal>

         {/* Terms Modal */}
         <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title={t('settings.terms')}>
            <View className="gap-4">
               <View>
                  <Text className="font-bold text-gray-900 dark:text-white mb-1">1. Uso de Datos</Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                     Esta aplicación recopila datos de ubicación únicamente para proporcionar servicios de navegación y alertas de proximidad mientras usas la app. Ningún dato personal es compartido con terceros.
                  </Text>
               </View>
               <View>
                  <Text className="font-bold text-gray-900 dark:text-white mb-1">2. Contenido Offline</Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                     Los mapas y guías descargados se almacenan localmente en tu dispositivo. Puedes eliminarlos en cualquier momento desde la sección "Gestión Offline".
                  </Text>
               </View>
            </View>
            <TouchableOpacity onPress={() => setActiveModal(null)} className="w-full bg-black dark:bg-white py-3 rounded-xl mt-4 items-center">
               <Text className="text-white dark:text-black font-bold">Entendido</Text>
            </TouchableOpacity>
         </Modal>

      </ScrollView>
   );
};

export default Settings;

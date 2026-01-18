import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal as RNModal, Alert, Switch, Linking } from 'react-native';
import { useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { AVATARS } from '@/constants';
import { LANGUAGES } from '@/translations';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavNative from '@/components/BottomNavNative';

// Modal Component helper
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; settings: any }> = ({ isOpen, onClose, title, children, settings }) => {
   return (
      <RNModal
         visible={isOpen}
         transparent={true}
         animationType="fade"
         onRequestClose={onClose}
         statusBarTranslucent
      >
         <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onStartShouldSetResponder={() => { onClose(); return true; }}>
            <View
               style={{ backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.25, shadowRadius: 8, maxHeight: '85%', overflow: 'hidden' }}
               onStartShouldSetResponder={(e) => { e.stopPropagation(); return true; }}
            >
               <View style={{ width: 48, height: 6, backgroundColor: settings.darkMode ? '#3f3f46' : '#e5e7eb', borderRadius: 3, marginHorizontal: 'auto', marginBottom: 24 }} />
               <View className="flex-row justify-between items-center mb-4">
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>{title}</Text>
                  <TouchableOpacity onPress={onClose} style={{ padding: 8, backgroundColor: settings.darkMode ? '#27272a' : '#f3f4f6', borderRadius: 20 }}>
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
         style={{ width: 48, height: 28, borderRadius: 14, justifyContent: 'center', backgroundColor: active ? '#10b981' : (settings.darkMode ? '#3f3f46' : '#e5e7eb') }}
      >
         <View className={`w-5 h-5 bg-white rounded-full shadow-md absolute ${active ? 'right-1' : 'left-1'}`} />
      </TouchableOpacity>
   );

   return (
      <View className="flex-1">
         <ScrollView style={{ flex: 1, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb' }} contentContainerStyle={{ paddingBottom: 100, paddingTop: 48, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.title')}</Text>

         <View className="gap-6">

            {/* SECCIÓN PERFIL */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2 flex-row items-center gap-2">
                  {t('settings.profile')}
                  {!userName && <View className="w-2 h-2 rounded-full bg-primary" />}
               </Text>
               <View style={{
                  backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                  borderRadius: 24,
                  padding: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  borderWidth: 1,
                  borderColor: settings.darkMode ? '#27272a' : '#f3f4f6'
               }}>

                  {/* Avatar Selection */}
                  <View className="flex-col items-center mb-6">
                     <View style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, borderWidth: 4, borderColor: settings.darkMode ? '#3f3f46' : '#ffffff' }} className={`${currentAvatar.bg}`}>
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

                  <View style={{ width: '100%', height: 1, backgroundColor: settings.darkMode ? '#3f3f46' : '#f3f4f6', marginBottom: 24 }} />

                  <View className="flex-row items-center gap-4 mb-2">
                     <View className="flex-1">
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-1">{t('settings.your_name')}</Text>
                        <TextInput
                           value={userName}
                           onChangeText={setUserName}
                           placeholder="Ej: Julián"
                           placeholderTextColor="#9ca3af"
                           style={{ 
                              width: '100%', 
                              backgroundColor: settings.darkMode ? '#27272a' : '#f9fafb',
                              borderBottomWidth: 2,
                              borderBottomColor: 'transparent',
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                              borderRadius: 8,
                              fontWeight: 'bold',
                              color: settings.darkMode ? '#ffffff' : '#111827'
                           }}
                        />
                     </View>
                  </View>
               </View>
            </View>

            {/* SECCIÓN DATOS OFFLINE */}
            <View>
               <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{t('settings.offline_data')}</Text>
               <View style={{ backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, borderWidth: 1, borderColor: settings.darkMode ? '#27272a' : '#f3f4f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <View className="flex-row items-center gap-3 flex-1">
                     <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: settings.darkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="wifi" size={20} color="#3b82f6" />
                     </View>
                     <View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }} numberOfLines={1}>{t('settings.wifi_only')}</Text>
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
               <View style={{
                  backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                  borderRadius: 24,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  borderWidth: 1,
                  borderColor: settings.darkMode ? '#27272a' : '#f3f4f6'
               }}>

                  {/* Dark Mode */}
                  <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: settings.darkMode ? '#3f3f46' : '#f9fafb' }}>
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="dark-mode" size={20} color="gray" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.dark_mode')}</Text>
                     </View>
                     <ToggleSwitch
                        active={settings.darkMode}
                        onChange={() => {
                           console.log('🌓 Cambiando darkMode de', settings.darkMode, 'a', !settings.darkMode);
                           updateSetting('darkMode', !settings.darkMode);
                        }}
                     />
                  </View>

                  {/* Language */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('language')}
                     className="w-full p-4 flex-row items-center justify-between"
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="translate" size={20} color="gray" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.language')}</Text>
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
               <View style={{
                  backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                  borderRadius: 24,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  borderWidth: 1,
                  borderColor: settings.darkMode ? '#27272a' : '#f3f4f6'
               }}>

                  {/* Voice */}
                  <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: settings.darkMode ? '#3f3f46' : '#f9fafb' }}>
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="volume-up" size={20} color="gray" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.voice')}</Text>
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
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.gps_accuracy')}</Text>
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
               <View style={{
                  backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                  borderRadius: 24,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  borderWidth: 1,
                  borderColor: settings.darkMode ? '#27272a' : '#f3f4f6'
               }}>

                  {/* Ayuda */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('help')}
                     style={{ width: '100%', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: settings.darkMode ? '#3f3f46' : '#f9fafb' }}
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="help" size={20} color="gray" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.help')}</Text>
                     </View>
                     <MaterialIcons name="arrow-forward-ios" size={14} color="#9ca3af" />
                  </TouchableOpacity>

                  {/* Acerca de */}
                  <TouchableOpacity
                     onPress={() => setActiveModal('about')}
                     style={{ width: '100%', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: settings.darkMode ? '#3f3f46' : '#f9fafb' }}
                  >
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons name="info" size={20} color="gray" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.about')} Chicoana Turismo</Text>
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
                        <Text style={{ fontSize: 14, fontWeight: '500', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('settings.terms')}</Text>
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
         <Modal isOpen={activeModal === 'language'} onClose={() => setActiveModal(null)} title={t('settings.language')} settings={settings}>
            <View className="gap-2">
               {LANGUAGES.map(lang => (
                  <TouchableOpacity
                     key={lang.code}
                     onPress={() => {
                        updateSetting('language', lang.code);
                        setActiveModal(null);
                     }}
                     style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: settings.language === lang.code ? '#10b981' : 'transparent', backgroundColor: settings.language === lang.code ? 'rgba(16, 185, 129, 0.2)' : (settings.darkMode ? '#27272a' : '#f9fafb') }}
                  >
                     <Text className="text-2xl mr-3">{lang.flag}</Text>
                     <Text style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', color: settings.language === lang.code ? '#10b981' : (settings.darkMode ? '#e5e7eb' : '#374151') }}>
                        {lang.label}
                     </Text>
                     {settings.language === lang.code && <MaterialIcons name="check-circle" size={20} color="#10b981" />}
                  </TouchableOpacity>
               ))}
            </View>
         </Modal>

         {/* Help Modal */}
         <Modal isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)} title={t('settings.help')} settings={settings}>
            <View className="gap-4">
               <Text style={{ color: settings.darkMode ? '#ffffff' : '#111827' }}>Si tienes emergencias o necesitas asistencia turística, comunícate con:</Text>
               <View style={{ backgroundColor: settings.darkMode ? '#27272a' : '#f9fafb', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: settings.darkMode ? '#3f3f46' : '#f3f4f6' }} className="gap-3">
                  <View className="flex-row items-center gap-3">
                     <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                        <MaterialIcons name="call" size={18} color="#2563eb" />
                     </View>
                     <View>
                        <Text className="text-xs font-bold text-gray-500">Atención al Turista (Muni)</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:03874907000')}>
                           <Text style={{ fontSize: 18, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>0387-490-7000</Text>
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
                           <Text style={{ fontSize: 18, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>911</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
               <Text className="text-xs italic text-gray-400">La atención presencial es en la oficina de turismo frente a la Plaza Principal, de Lunes a Domingo de 8:00 a 20:00 hs.</Text>
            </View>
         </Modal>

         {/* About Modal */}
         <Modal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title={t('settings.about')} settings={settings}>
            <View className="items-center mb-6">
               <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center mb-4 shadow-sm rotate-3">
                  <MaterialIcons name="landscape" size={40} color="black" />
               </View>
               <Text style={{ fontSize: 24, fontWeight: '900', color: settings.darkMode ? '#ffffff' : '#111827' }}>Chicoana Turismo</Text>
               <Text className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Guía Oficial Offline</Text>
            </View>

            <View style={{ backgroundColor: settings.darkMode ? '#27272a' : '#f9fafb', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: settings.darkMode ? '#3f3f46' : '#f3f4f6', marginBottom: 16 }}>
               <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Desarrollado por</Text>
               <View className="flex-row items-center gap-3">
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: settings.darkMode ? '#3f3f46' : '#e5e7eb' }} className="items-center justify-center">
                     <MaterialIcons name="person" size={24} color="gray" />
                  </View>
                  <View>
                     <Text style={{ fontSize: 16, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>Lucas Roman</Text>
                     <Text className="text-xs text-gray-500">Salta Capital, Argentina</Text>
                  </View>
               </View>
            </View>
            <Text className="text-center text-xs text-gray-400">
               Hecho con ❤️ para promover el turismo en nuestros hermosos valles.
            </Text>
         </Modal>

         {/* Terms Modal */}
         <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title={t('settings.terms')} settings={settings}>
            <View className="gap-4">
               <View>
                  <Text style={{ fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827', marginBottom: 4 }}>1. Uso de Datos</Text>
                  <Text style={{ fontSize: 12, color: settings.darkMode ? '#9ca3af' : '#4b5563' }}>
                     Esta aplicación recopila datos de ubicación únicamente para proporcionar servicios de navegación y alertas de proximidad mientras usas la app. Ningún dato personal es compartido con terceros.
                  </Text>
               </View>
               <View>
                  <Text style={{ fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827', marginBottom: 4 }}>2. Contenido Offline</Text>
                  <Text style={{ fontSize: 12, color: settings.darkMode ? '#9ca3af' : '#4b5563' }}>
                     Los mapas y guías descargados se almacenan localmente en tu dispositivo. Puedes eliminarlos en cualquier momento desde la sección "Gestión Offline".
                  </Text>
               </View>
            </View>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={{ width: '100%', backgroundColor: settings.darkMode ? '#ffffff' : '#000000', paddingVertical: 12, borderRadius: 12, marginTop: 16, alignItems: 'center' }}>
               <Text style={{ color: settings.darkMode ? '#000000' : '#ffffff', fontWeight: 'bold' }}>Entendido</Text>
            </TouchableOpacity>
         </Modal>

      </ScrollView>
      <BottomNavNative />
      </View>
   );
};

export default Settings;

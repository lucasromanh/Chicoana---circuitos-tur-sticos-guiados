import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigate, useLocation } from '@/navigation/routerAdapter';
import { CIRCUITS } from '@/constants';
import { useUser } from '@/contexts/UserContext';
import { calculateOfflineRoute, Coordinate, RouteResult } from '@/services/map/geoEngine';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ActiveNavigation: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   // @ts-ignore
   const { t, circuits, downloadedCircuits, simulateDownload } = useUser();

   const state = location.state as { circuitId: string } | null;
   const activeCircuitId = state?.circuitId || 'historic-center';
   const activeCircuit = circuits.find((c: any) => c.id === activeCircuitId) || CIRCUITS[0];

   const isCarMode = activeCircuit ? parseInt(activeCircuit.distance) > 10 : false;
   const isMapDownloaded = downloadedCircuits.includes('chicoana-map-pack');

   const [distance, setDistance] = useState(isCarMode ? 5000 : 50);
   const [isMuted, setIsMuted] = useState(false);
   const [isDownloadingMap, setIsDownloadingMap] = useState(false);

   // --- MAP STATE ---
   const mapRef = useRef<MapView>(null);
   const [mapReady, setMapReady] = useState(false);

   // Simulation State
   const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
   const [userLocation, setUserLocation] = useState<Coordinate>({ lat: -25.10600, lng: -65.53455 });
   const [isFollowing, setIsFollowing] = useState(true);

   // 1. CALCULAR RUTA DEMO
   useEffect(() => {
      const route = calculateOfflineRoute(
         { lat: -25.10600, lng: -65.53455 },
         { lat: -25.10445, lng: -65.53455 },
         'walking'
      );

      if (route) {
         setActiveRoute(route);
      }
   }, []);

   // 2. SIMULACIÓN DE MOVIMIENTO
   useEffect(() => {
      if (!activeRoute || !mapReady) return;

      let currentIndex = 0;
      const path = activeRoute.path;

      const interval = setInterval(() => {
         if (currentIndex >= path.length - 1) {
            currentIndex = 0;
            setDistance(50);
         }

         const currentPos = path[currentIndex];
         setUserLocation(currentPos);

         if (isFollowing && mapRef.current) {
            mapRef.current.animateCamera({
               center: { latitude: currentPos.lat, longitude: currentPos.lng },
               heading: 0,
               pitch: 45,
               zoom: 19,
            }, { duration: 1000 });
         }

         setDistance(prev => Math.max(0, prev - 2));
         currentIndex++;
      }, 1000);

      return () => clearInterval(interval);
   }, [activeRoute, mapReady, isFollowing]);

   const handleRecenter = () => {
      setIsFollowing(true);
      if (mapRef.current) {
         mapRef.current.animateToRegion({
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
         }, 500);
      }
   };

   const handleDownloadMap = async () => {
      setIsDownloadingMap(true);
      await simulateDownload('chicoana-map-pack');
      setIsDownloadingMap(false);
   };

   return (
      <View className="flex-1 bg-gray-200 dark:bg-gray-900">

         {/* MAPA NATIVO */}
         <View className="absolute inset-0 z-0">
            <MapView
               ref={mapRef}
               provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
               style={{ flex: 1 }}
               onMapReady={() => setMapReady(true)}
               initialRegion={{
                  latitude: -25.10600,
                  longitude: -65.53455,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
               }}
               showsUserLocation={false}
               onTouchStart={() => setIsFollowing(false)}
            >
               {/* Ruta Sombra */}
               {activeRoute && (
                  <Polyline
                     coordinates={activeRoute.path.map(p => ({ latitude: p.lat, longitude: p.lng }))}
                     strokeColor="#1a5f7a4d" // hex with opacity
                     strokeWidth={10}
                  />
               )}
               {/* Ruta Principal */}
               {activeRoute && (
                  <Polyline
                     coordinates={activeRoute.path.map(p => ({ latitude: p.lat, longitude: p.lng }))}
                     strokeColor="#3b82f6"
                     strokeWidth={6}
                  />
               )}

               {/* Marcador Usuario Custom */}
               <Marker coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}>
                  <View className="items-center justify-center w-12 h-12">
                     <View className="w-8 h-8 bg-blue-500/20 rounded-full absolute animate-pulse scale-150" />
                     <View className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-blue-600 shadow-md transform -translate-y-1" />
                  </View>
               </Marker>

            </MapView>

            <LinearGradient
               colors={['rgba(255,255,255,0.6)', 'transparent', 'rgba(255,255,255,0.4)']}
               className="absolute inset-0 pointer-events-none"
            />
         </View>

         {/* UI OVERLAY */}

         {/* 1. Top Bar */}
         <View className="absolute top-12 left-3 right-3 z-20">
            <View className="bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg p-1.5 pl-2 pr-2 flex-row items-center border border-gray-100 dark:border-gray-800">
               <TouchableOpacity onPress={() => navigate(-1)} className="w-8 h-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                  <MaterialIcons name="arrow-back" size={20} color="gray" />
               </TouchableOpacity>
               <View className="flex-1 px-3">
                  <Text className="text-xs font-bold text-gray-900 dark:text-white" numberOfLines={1}>{activeCircuit?.title || t('navigation.title')}</Text>
                  <Text className="text-[10px] text-gray-500 font-medium">15 {t('navigation.min_left')} • 1.2 {t('circuit.distance')}</Text>
               </View>

               {!isMapDownloaded ? (
                  <TouchableOpacity
                     onPress={handleDownloadMap}
                     disabled={isDownloadingMap}
                     className="mr-2 px-3 py-1 bg-primary rounded-full flex-row items-center gap-1 shadow-sm"
                  >
                     {isDownloadingMap ? (
                        <ActivityIndicator size="small" color="black" />
                     ) : (
                        <MaterialIcons name="download" size={14} color="black" />
                     )}
                     <Text className="text-[10px] font-bold text-black" style={{ marginBottom: 2 }}>Mapa</Text>
                  </TouchableOpacity>
               ) : (
                  <View className="mr-2 px-2 py-1 bg-green-100 rounded-full flex-row items-center gap-1">
                     <MaterialIcons name="check" size={14} color="green" />
                  </View>
               )}

               <TouchableOpacity
                  onPress={() => setIsMuted(!isMuted)}
                  className={`w-8 h-8 rounded-full items-center justify-center ${isMuted ? 'bg-red-50' : ''}`}
               >
                  <MaterialIcons name={isMuted ? 'volume-off' : 'volume-up'} size={20} color={isMuted ? 'red' : 'gray'} />
               </TouchableOpacity>
            </View>
         </View>

         {/* 2. Map Controls */}
         <View className="absolute right-3 top-36 gap-3 z-20">
            <TouchableOpacity
               onPress={handleRecenter}
               className={`w-10 h-10 rounded-xl shadow-lg items-center justify-center border border-gray-100 dark:border-gray-700 ${isFollowing ? 'bg-primary border-primary' : 'bg-white dark:bg-gray-800'}`}
            >
               <MaterialIcons name="my-location" size={20} color={isFollowing ? 'black' : 'gray'} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg items-center justify-center border border-gray-100 dark:border-gray-700">
               <MaterialIcons name="layers" size={20} color="gray" />
            </TouchableOpacity>
         </View>

         {/* 3. Bottom Card */}
         <View className="absolute bottom-6 left-3 right-3 z-30">
            <View className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl p-5 border border-gray-100 dark:border-gray-800">

               <View className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full self-center mb-4" />

               {/* Instruction Block */}
               <View className="flex-row items-center gap-4 mb-6">
                  <View className="bg-primary w-[4.5rem] h-[4.5rem] rounded-2xl items-center justify-center shadow-lg shadow-primary/20">
                     <MaterialIcons name="turn-right" size={40} color="black" />
                  </View>
                  <View className="flex-1">
                     <Text className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1">{t('navigation.turn_right')}</Text>
                     <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('navigation.in')} <Text className="text-gray-900 dark:text-white font-bold">Calle España</Text>
                     </Text>
                     <View className="mt-1.5 flex-row items-center self-start gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                        <MaterialIcons name="straighten" size={14} color="gray" />
                        <Text className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round(distance)}{t('navigation.meters')}</Text>
                     </View>
                  </View>
               </View>

               <View className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-6" />

               {/* Steps List */}
               <View className="gap-5 mb-8 pl-1">
                  <View className="flex-row items-center gap-4">
                     <View className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 items-center justify-center border border-gray-100 dark:border-gray-700">
                        <MaterialIcons name="arrow-upward" size={16} color="#9ca3af" />
                     </View>
                     <View className="flex-1 border-b border-gray-50 dark:border-gray-800 pb-2">
                        <Text className="text-xs font-bold text-gray-900 dark:text-white">{t('navigation.go_straight')} 200{t('navigation.meters')}</Text>
                        <Text className="text-[10px] text-gray-400">{t('navigation.continue_on')} Calle España</Text>
                     </View>
                  </View>

                  <View className="flex-row items-center gap-4">
                     <View className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 items-center justify-center border border-gray-100 dark:border-gray-700">
                        <MaterialIcons name="photo-camera" size={16} color="#4b5563" />
                     </View>
                     <View className="flex-1 border-b border-gray-50 dark:border-gray-800 pb-2">
                        <Text className="text-xs font-bold text-gray-900 dark:text-white">Plaza Martín Miguel de Güemes</Text>
                        <Text className="text-[10px] text-gray-400">{t('navigation.poi_nearby')} • Foto</Text>
                     </View>
                  </View>

                  <View className="flex-row items-center gap-4 opacity-60">
                     <View className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 items-center justify-center border border-gray-100 dark:border-gray-700">
                        <MaterialIcons name="church" size={16} color="#9ca3af" />
                     </View>
                     <View>
                        <Text className="text-xs font-bold text-gray-900 dark:text-white">Iglesia San Pablo</Text>
                        <Text className="text-[10px] text-gray-400">{t('navigation.dest_final')}</Text>
                     </View>
                  </View>
               </View>

               {/* Buttons */}
               <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl items-center justify-center flex-row gap-2">
                     <MaterialIcons name="refresh" size={18} color="gray" />
                     <Text className="font-bold text-gray-700 dark:text-gray-300 text-xs">{t('navigation.recalculate')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => navigate('/home')}
                     className="flex-1 py-3.5 bg-red-50 dark:bg-red-900/10 rounded-xl items-center justify-center flex-row gap-2"
                  >
                     <MaterialIcons name="flag" size={18} color="#ef4444" />
                     <Text className="font-bold text-red-500 text-xs">{t('navigation.finish')}</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>

      </View>
   );
};

export default ActiveNavigation;

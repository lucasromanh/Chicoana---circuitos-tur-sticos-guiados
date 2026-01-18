import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useParams, useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

const CircuitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // @ts-ignore
  const { favorites, toggleFavorite, downloadedCircuits, simulateDownload, visitedPois, t, circuits, settings } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);

  console.log('📍 CircuitDetail - ID recibido:', id);
  console.log('📍 CircuitDetail - Circuits disponibles:', circuits?.map((c: any) => ({ id: c.id, title: c.title })));
  
  const circuit = circuits.find((c: any) => c.id === id);
  
  console.log('📍 CircuitDetail - Circuito encontrado:', circuit?.title, circuit?.id);

  if (!circuit) return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-gray-500">Circuito no encontrado</Text>
    </View>
  );

  const isFav = favorites.includes(circuit.id);
  const isDownloaded = downloadedCircuits.includes(circuit.id);

  const handleDownload = async () => {
    if (isDownloaded) return;
    setIsDownloading(true);
    await simulateDownload(circuit.id);
    setIsDownloading(false);
  };

  const handleStartCircuit = async () => {
    console.log('🚀 Iniciando circuito:', circuit.id);
    if (!isDownloaded) {
      setIsDownloading(true);
      await simulateDownload(circuit.id);
      setIsDownloading(false);
    }

    if (circuit.pois && circuit.pois.length > 0) {
      navigate(`/poi/${circuit.pois[0].id}`);
    } else {
      // Para React Navigation nativo
      navigate('/navigation', { state: { circuitId: circuit.id } });
    }
  };

  const handleOpenMap = () => {
    console.log('🗺️ Abriendo mapa para circuito:', circuit.id);
    // Para React Navigation nativo
    navigate('/navigation', { state: { circuitId: circuit.id } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-72 bg-gray-200 dark:bg-gray-800">
          <Image
            source={{ uri: circuit.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* Degradado superior oscuro */}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            locations={[0, 0.3]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%' }}
          />
          {/* Degradado inferior oscuro con blur effect */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.75)']}
            locations={[0, 0.5, 1]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }}
          />

          {/* Navigation Bar */}
          <View className="absolute top-12 left-0 right-0 px-4 flex-row justify-between items-center z-10">
            <TouchableOpacity onPress={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleFavorite(circuit.id)}
              className={`w-10 h-10 rounded-full items-center justify-center ${isFav ? 'bg-red-500' : 'bg-white/20 border border-white/20'}`}
            >
              <MaterialIcons name={isFav ? "favorite" : "favorite-border"} size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="absolute bottom-6 left-0 px-6 w-full">
            <View className="bg-primary px-2 py-1 rounded self-start mb-2 shadow-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4 }}>
              <Text className="text-black text-xs font-bold uppercase">{circuit.difficulty}</Text>
            </View>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#ffffff', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 }}>{circuit.title}</Text>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="straighten" size={16} color="#ffffff" />
                <Text style={{ fontSize: 14, color: '#ffffff', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>{circuit.distance} {t('circuit.distance')}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="schedule" size={16} color="#ffffff" />
                <Text style={{ fontSize: 14, color: '#ffffff', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>{circuit.duration} {t('circuit.duration')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 8, marginTop: -16, position: 'relative', zIndex: 10, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          {/* Description */}
          <Text style={{ color: settings.darkMode ? '#d1d5db' : '#4b5563', lineHeight: 22, marginBottom: 24, fontSize: 14, paddingTop: 16 }}>
            {circuit.description}
          </Text>

          {/* Offline Status Card */}
          <View style={{ backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderWidth: 1, borderColor: settings.darkMode ? '#27272a' : '#f3f4f6', borderRadius: 16, padding: 16, marginBottom: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}>
            <View className="flex-row items-center gap-3">
              <View className={`w-10 h-10 rounded-full items-center justify-center ${isDownloaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#4b5563" />
                ) : (
                  <MaterialIcons name={isDownloaded ? "check-circle" : "cloud-download"} size={20} color={isDownloaded ? "#16a34a" : "#6b7280"} />
                )}
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>
                  {isDownloaded ? t('circuit.available_offline') : isDownloading ? t('circuit.downloading') : t('circuit.download')}
                </Text>
                <Text className="text-xs text-gray-500 font-bold">
                  {isDownloaded ? t('circuit.ready') : `${circuit.downloadSize}`}
                </Text>
              </View>
            </View>
            {!isDownloaded && !isDownloading && (
              <TouchableOpacity
                onPress={handleDownload}
                className="px-4 py-2 bg-gray-900 dark:bg-white rounded-full"
              >
                <Text className="text-white dark:text-black text-xs font-bold">{t('circuit.download')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* POI Timeline */}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, paddingHorizontal: 8, color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('circuit.pois')}</Text>
          <View className="pl-4">
            {/* Vertical Line */}
            <View className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

            {circuit.pois && circuit.pois.length > 0 ? circuit.pois.map((poi: any, index: number) => {
              const isVisited = visitedPois.includes(poi.id);
              const distDisplay = poi.distanceFromStart.includes('Inicio')
                ? `0.0 km (${t('circuit.start_point')})`
                : poi.distanceFromStart;

              return (
                <TouchableOpacity
                  key={poi.id}
                  onPress={() => navigate(`/poi/${poi.id}`)}
                  className={`flex-row gap-4 mb-4 ${isVisited ? 'opacity-60' : ''}`}
                >
                  {/* Timeline Node */}
                  <View className={`relative z-10 w-7 h-7 rounded-full border-4 border-gray-50 dark:border-zinc-950 items-center justify-center shrink-0 ${isVisited ? 'bg-green-500' : 'bg-primary'}`}>
                    {isVisited ? (
                      <MaterialIcons name="check" size={12} color="white" />
                    ) : (
                      <Text className="text-[10px] font-bold text-black">{index + 1}</Text>
                    )}
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1, backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: settings.darkMode ? '#27272a' : '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, flexDirection: 'row', gap: 12 }}>
                    <Image
                      source={{ uri: poi.image }}
                      style={{ width: 64, height: 64, borderRadius: 8 }}
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-0.5">
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: settings.darkMode ? '#ffffff' : '#111827', flex: 1, paddingRight: 8 }} numberOfLines={1}>{poi.title}</Text>
                        <Text className="text-[10px] text-gray-400">{distDisplay}</Text>
                      </View>
                      <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>{poi.description}</Text>

                      {poi.audioDuration && (
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="headphones" size={14} color="#80EC13" />
                          <Text className="text-[10px] font-bold text-primary-dark dark:text-primary">{t('circuit.audio_label')} • {poi.audioDuration}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }) : (
              <Text className="pl-8 text-sm text-gray-500 italic">{t('circuit.offline_req')}</Text>
            )}
          </View>

          {/* Mapa del recorrido */}
          {circuit.pois && circuit.pois.length > 0 && (
            <View className="mt-8 mb-4">
              <Text className="text-lg font-bold mb-4 px-2 dark:text-white">{t('circuit.route_map')}</Text>
              <View className="rounded-2xl overflow-hidden" style={{ height: 300 }}>
                <MapView
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: -25.10445,
                    longitude: -65.53455,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                >
                  {circuit.pois.map((poi: any, index: number) => {
                    const lat = poi.lat || (-25.10445 + (index * 0.002));
                    const lng = poi.lng || (-65.53455 + (index * 0.002));
                    return (
                      <Marker
                        key={poi.id}
                        coordinate={{ latitude: lat, longitude: lng }}
                        title={poi.title}
                        description={poi.description}
                      >
                        <View style={{ backgroundColor: '#10b981', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' }}>
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{index + 1}</Text>
                        </View>
                      </Marker>
                    );
                  })}
                  
                  {/* Línea de ruta */}
                  <Polyline
                    coordinates={circuit.pois.map((poi: any, index: number) => ({
                      latitude: poi.lat || (-25.10445 + (index * 0.002)),
                      longitude: poi.lng || (-65.53455 + (index * 0.002))
                    }))}
                    strokeColor="#10b981"
                    strokeWidth={3}
                  />
                </MapView>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb', zIndex: 40, borderTopWidth: 1, borderTopColor: settings.darkMode ? '#27272a' : '#f3f4f6' }}>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleOpenMap}
            style={{ flex: 1, backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderWidth: 1, borderColor: settings.darkMode ? '#3f3f46' : '#e5e7eb', paddingVertical: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <MaterialIcons name="map" size={20} color={settings.darkMode ? 'white' : 'black'} />
            <Text style={{ fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>{t('circuit.map')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleStartCircuit}
            style={{ flex: 2, backgroundColor: '#000000', paddingVertical: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <MaterialIcons name="play-circle" size={20} color="white" />
            <Text className="font-bold text-white">{isDownloading ? t('circuit.downloading') : t('circuit.start_guided')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CircuitDetail;

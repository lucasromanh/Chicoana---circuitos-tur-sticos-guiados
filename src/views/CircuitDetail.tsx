import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Platform, ActivityIndicator, useColorScheme } from 'react-native';
import { useParams, useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CircuitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // @ts-ignore
  const { favorites, toggleFavorite, downloadedCircuits, simulateDownload, visitedPois, t, circuits } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);
  const colorScheme = useColorScheme();

  const circuit = circuits.find((c: any) => c.id === id);

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
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-72 bg-gray-200 dark:bg-gray-800">
          <Image
            source={{ uri: circuit.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,1)']}
            locations={[0, 0.4, 0.8, 1]}
            className="absolute inset-0"
          />
          {/* Dark mode gradient fix or conditional */}
          <View className="absolute inset-0 bg-transparent dark:bg-black/20" />

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
            <View className="bg-primary px-2 py-1 rounded self-start mb-2 shadow-sm">
              <Text className="text-black text-xs font-bold uppercase">{circuit.difficulty}</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1 shadow-black/50 drop-shadow-md">{circuit.title}</Text>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="straighten" size={16} color="#e5e7eb" />
                <Text className="text-sm text-gray-200 font-medium shadow-black/50">{circuit.distance} {t('circuit.distance')}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="schedule" size={16} color="#e5e7eb" />
                <Text className="text-sm text-gray-200 font-medium shadow-black/50">{circuit.duration} {t('circuit.duration')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 py-2 -mt-4 relative z-10 bg-gray-50 dark:bg-zinc-950 rounded-t-[20px]">
          {/* Description */}
          <Text className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm pt-4">
            {circuit.description}
          </Text>

          {/* Offline Status Card */}
          <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 mb-8 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center gap-3">
              <View className={`w-10 h-10 rounded-full items-center justify-center ${isDownloaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#4b5563" />
                ) : (
                  <MaterialIcons name={isDownloaded ? "check-circle" : "cloud-download"} size={20} color={isDownloaded ? "#16a34a" : "#6b7280"} />
                )}
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-900 dark:text-white">
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
          <Text className="text-lg font-bold mb-4 px-2 dark:text-white">{t('circuit.pois')}</Text>
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
                  <View className="flex-1 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex-row gap-3">
                    <Image
                      source={{ uri: poi.image }}
                      style={{ width: 64, height: 64, borderRadius: 8 }}
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-0.5">
                        <Text className="font-bold text-sm text-gray-900 dark:text-white flex-1 pr-2" numberOfLines={1}>{poi.title}</Text>
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
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View className="absolute bottom-0 left-0 w-full px-4 pt-4 pb-8 bg-gray-50 dark:bg-zinc-950 z-40 border-t border-gray-100 dark:border-gray-800">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleOpenMap}
            className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 py-4 rounded-2xl shadow-sm flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="map" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
            <Text className="font-bold text-gray-900 dark:text-white">{t('circuit.map')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleStartCircuit}
            className="flex-[2] bg-black py-4 rounded-2xl shadow-lg flex-row items-center justify-center gap-2"
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

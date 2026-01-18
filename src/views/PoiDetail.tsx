import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useParams, useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Audio } from 'expo-av';

const PoiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // @ts-ignore
  const { circuits, visitedPois, markPoiAsVisited, t, settings } = useUser();

  const [activeTab, setActiveTab] = useState<'info' | 'audio' | 'gallery'>('info');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const videoRef = useRef<Video>(null);
  const [videoStatus, setVideoStatus] = useState<any>({});

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPauseAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      try {
        // Configurar el modo de audio para permitir sonido
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: poi.audioUrl },
          { shouldPlay: true, volume: 1.0 },
          (status) => {
            if (status.isLoaded && !status.isPlaying) {
              setIsPlaying(false);
            }
          }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    }
  };

  // Find POI
  let poi: any = null;
  let parentCircuit: any = null;

  for (const c of circuits) {
    const found = c.pois.find((p: any) => p.id === id);
    if (found) {
      poi = found;
      parentCircuit = c;
      break;
    }
  }

  if (!poi) return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <Text className="text-gray-500">Punto de interés no encontrado ({id})</Text>
    </View>
  );

  const isVisited = visitedPois.includes(poi.id);
  const currentIndex = parentCircuit.pois.findIndex((p: any) => p.id === poi.id);
  const nextPoi = parentCircuit.pois[currentIndex + 1];

  const handleNext = () => {
    markPoiAsVisited(poi.id);
    if (nextPoi) {
      navigate(`/poi/${nextPoi.id}`);
    } else {
      navigate('/home'); // O fin del circuito
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-96 bg-gray-200 dark:bg-gray-800">
          <Image
            source={{ uri: poi.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0"
          />

          {/* Navigation Bar */}
          <View className="absolute top-12 left-0 right-0 px-4 flex-row justify-between items-center z-10">
            <TouchableOpacity onPress={() => navigate(-1)} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-md">
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-md"
              onPress={() => { /* Opción de compartir o más info */ }}
            >
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Title Overlay */}
          <View className="absolute bottom-0 left-0 w-full p-6 pt-12">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="px-2 py-1 bg-primary rounded-md shadow-sm">
                <Text className="text-[10px] font-bold text-black uppercase">{t('circuit.poi_type')}</Text>
              </View>
              {isVisited && (
                <View className="px-2 py-1 bg-green-500 rounded-md shadow-sm flex-row items-center gap-1">
                  <MaterialIcons name="check" size={12} color="white" />
                  <Text className="text-[10px] font-bold text-white uppercase">{t('circuit.visited')}</Text>
                </View>
              )}
            </View>
            <Text className="text-3xl font-display font-bold text-white leading-tight shadow-black/50 drop-shadow-md">
              {poi.title}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb', marginTop: -24, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16, position: 'relative', zIndex: 10 }}>
          {/* Controls Bar */}
          <View style={{ backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderRadius: 16, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, borderWidth: 1, borderColor: settings.darkMode ? '#27272a' : '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <View className="flex-row">
              {(['info', 'audio', 'gallery'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl flex-row items-center gap-2 ${activeTab === tab ? 'bg-primary' : 'transparent'}`}
                >
                  <MaterialIcons
                    name={tab === 'info' ? 'description' : tab === 'audio' ? 'headphones' : 'photo-library'}
                    size={18}
                    color={activeTab === tab ? 'black' : 'gray'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {poi.audioDuration && (
              <TouchableOpacity
                onPress={playPauseAudio}
                className="w-12 h-12 bg-black rounded-xl items-center justify-center shadow-lg active:scale-95"
              >
                <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <View>
            {activeTab === 'info' && (
              <View>
                {/* Descripción */}
                <Text style={{ fontSize: 16, color: settings.darkMode ? '#d1d5db' : '#374151', lineHeight: 24, marginBottom: 24 }}>
                  {poi.description}
                  {'\n\n'}
                  Este lugar histórico representa uno de los puntos más emblemáticos del circuito. Su arquitectura colonial se conserva casi intacta desde el siglo XVIII.
                  {'\n\n'}
                  Los visitantes pueden apreciar los detalles en los muros de adobe y los techos de caña y barro, técnicas constructivas típicas de la época.
                </Text>

                {/* Audio Player */}
                {poi.audioUrl && (
                  <View style={{ backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: settings.darkMode ? '#27272a' : '#f3f4f6' }}>
                    <View className="flex-row items-center gap-3 mb-3">
                      <View style={{ width: 48, height: 48, backgroundColor: '#10b981', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="audiotrack" size={24} color="black" />
                      </View>
                      <View className="flex-1">
                        <Text style={{ fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827', marginBottom: 2 }}>Audio Guía</Text>
                        <Text className="text-xs text-gray-400">Duración: {poi.audioDuration || '02:30'}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={playPauseAudio}
                        style={{ width: 48, height: 48, backgroundColor: '#000000', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%', backgroundColor: settings.darkMode ? '#27272a' : '#f3f4f6', height: 4, borderRadius: 2, overflow: 'hidden' }}>
                      <View style={{ backgroundColor: '#10b981', width: '30%', height: '100%', borderRadius: 2 }} />
                    </View>
                  </View>
                )}

                {/* Video Player */}
                {poi.videoUrl && (
                  <View style={{ marginBottom: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' }}>
                    <Video
                      ref={videoRef}
                      source={{ uri: poi.videoUrl }}
                      style={{ width: '100%', height: 220 }}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
                      volume={1.0}
                      isMuted={false}
                    />
                  </View>
                )}
              </View>
            )}

            {activeTab === 'audio' && (
              <View className="items-center py-8">
                <View style={{ width: 120, height: 120, backgroundColor: settings.darkMode ? '#27272a' : '#f3f4f6', borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 6, borderColor: settings.darkMode ? '#3f3f46' : '#e5e7eb' }}>
                  <MaterialIcons name="audiotrack" size={48} color="#10b981" />
                </View>
                <Text style={{ fontSize: 18, color: settings.darkMode ? '#ffffff' : '#111827', fontWeight: 'bold', marginBottom: 8 }}>Audio Guía Completa</Text>
                <Text style={{ fontSize: 14, color: settings.darkMode ? '#9ca3af' : '#6b7280', marginBottom: 24 }}>Duración: {poi.audioDuration || '02:30'}</Text>
                
                {/* Play Button */}
                <TouchableOpacity
                  onPress={playPauseAudio}
                  style={{ width: 80, height: 80, backgroundColor: '#10b981', borderRadius: 40, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, marginBottom: 24 }}
                >
                  <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={40} color="black" />
                </TouchableOpacity>

                {/* Progress Bar */}
                <View className="w-full">
                  <View style={{ width: '100%', backgroundColor: settings.darkMode ? '#27272a' : '#f3f4f6', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ backgroundColor: '#10b981', width: '35%', height: '100%', borderRadius: 3 }} />
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-xs text-gray-400">0:52</Text>
                    <Text className="text-xs text-gray-400">{poi.audioDuration || '02:30'}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'gallery' && (
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827', marginBottom: 16 }}>Galería de Imágenes</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[poi.image, ...Array(5).fill(null).map((_, i) => `https://picsum.photos/300/300?random=${poi.id}-${i}`)].map((imgUrl, i) => (
                    <TouchableOpacity key={i} style={{ width: '48%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: settings.darkMode ? '#27272a' : '#f3f4f6' }}>
                      <Image
                        source={{ uri: imgUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', paddingHorizontal: 16, paddingBottom: 32, paddingTop: 16, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb', borderTopWidth: 1, borderTopColor: settings.darkMode ? '#27272a' : '#f3f4f6', zIndex: 40 }}>
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => navigate(-1)}
            style={{ flex: 1, paddingVertical: 16, backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderWidth: 1, borderColor: settings.darkMode ? '#3f3f46' : '#e5e7eb', borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
          >
            <Text style={{ fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827' }}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex-[2] py-4 bg-primary rounded-2xl items-center justify-center shadow-lg active:scale-[0.98] flex-row gap-2"
          >
            <Text className="font-bold text-black">{nextPoi ? 'Siguiente Punto' : 'Finalizar'}</Text>
            <MaterialIcons name="arrow-forward" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PoiDetail;

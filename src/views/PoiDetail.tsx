import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useParams, useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PoiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // @ts-ignore
  const { circuits, visitedPois, markPoiAsVisited, t } = useUser();

  const [activeTab, setActiveTab] = useState<'info' | 'audio' | 'gallery'>('info');
  const [isPlaying, setIsPlaying] = useState(false);

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
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-96 bg-gray-200 dark:bg-gray-800">
          <Image
            source={{ uri: poi.image }}
            className="w-full h-full"
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

        <View className="flex-1 bg-gray-50 dark:bg-zinc-950 -mt-6 rounded-t-[2rem] px-6 pt-8 pb-4 relative z-10">
          {/* Controls Bar */}
          <View className="bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-800 flex-row justify-between items-center mb-6">
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
                onPress={() => setIsPlaying(!isPlaying)}
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
                <Text className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
                  {poi.description}
                  {/* Simulación de más texto para demo */}
                  {'\n\n'}
                  Este lugar histórico representa uno de los puntos más emblemáticos del circuito. Su arquitectura colonial se conserva casi intacta desde el siglo XVIII.
                  {'\n\n'}
                  Los visitantes pueden apreciar los detalles en los muros de adobe y los techos de caña y barro, técnicas constructivas típicas de la época.
                </Text>
              </View>
            )}

            {activeTab === 'audio' && (
              <View className="items-center justify-center py-8">
                <View className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mb-4 border-4 border-gray-200 dark:border-zinc-700">
                  <MaterialIcons name="audiotrack" size={32} color="gray" />
                </View>
                <Text className="text-gray-500 dark:text-gray-400 font-bold mb-2">Audio Guía</Text>
                <Text className="text-xs text-gray-400">Duración: {poi.audioDuration || '02:30'}</Text>
                <View className="w-full bg-gray-200 dark:bg-zinc-800 h-1 rounded-full mt-6 overflow-hidden">
                  <View className="bg-primary w-1/3 h-full rounded-full" />
                </View>
              </View>
            )}

            {activeTab === 'gallery' && (
              <View className="flex-row flex-wrap gap-2">
                {[1, 2, 3].map(i => (
                  <Image
                    key={i}
                    source={{ uri: `https://source.unsplash.com/random/200x200?sig=${i}` }}
                    className="w-[30%] aspect-square rounded-xl bg-gray-200"
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 w-full px-4 pb-8 pt-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-gray-800 z-40">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => navigate(-1)}
            className="flex-1 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-2xl items-center justify-center shadow-sm"
          >
            <Text className="font-bold text-gray-900 dark:text-white">Volver</Text>
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

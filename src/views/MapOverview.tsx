import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigate } from '@/navigation/routerAdapter';
import { useUser } from '@/contexts/UserContext';
import { CIRCUITS } from '@/constants';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MapOverview: React.FC = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const { t, circuits } = useUser();
  const [filter, setFilter] = useState<'all' | 'historic' | 'nature'>('all');
  const [activePoi, setActivePoi] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  // Filter Logic
  const filteredCircuits = circuits.filter((c: any) => {
    if (filter === 'all') return true;
    if (filter === 'historic') return c.category === 'Históricos';
    if (filter === 'nature') return c.category === 'Naturaleza';
    return true;
  });

  const allPois = filteredCircuits.flatMap((c: any, circuitIndex: number) => 
    c.pois.map((p: any, poiIndex: number) => ({ 
      ...p, 
      circuitColor: c.color || '#10b981', 
      circuitId: c.id,
      // Coordenadas de ejemplo para Chicoana
      lat: p.lat || (-25.10445 + (circuitIndex * 0.002) + (poiIndex * 0.001)),
      lng: p.lng || (-65.53455 + (circuitIndex * 0.002) + (poiIndex * 0.001))
    }))
  );

  const handleMarkerPress = (poi: any) => {
    setActivePoi(poi);
    // Center map on marker slightly offset to accommodate bottom sheet
    mapRef.current?.animateCamera({
      center: { latitude: poi.lat, longitude: poi.lng },
      zoom: 16
    });
  };

  return (
    <View className="flex-1 bg-gray-200 dark:bg-zinc-900">
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -25.10445,
          longitude: -65.53455,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onPress={() => setActivePoi(null)}
      >
        {allPois.map((poi: any) => (
          <Marker
            key={`${poi.circuitId}-${poi.id}`}
            coordinate={{ latitude: poi.lat, longitude: poi.lng }}
            onPress={() => handleMarkerPress(poi)}
          >
            <View className={`p-1.5 rounded-full border-2 border-white shadow-sm ${activePoi?.id === poi.id ? 'bg-black scale-125' : 'bg-primary'}`} style={{ backgroundColor: activePoi?.id === poi.id ? 'black' : poi.circuitColor }}>
              <MaterialIcons name="place" size={16} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header / Filter Bar */}
      <View className="absolute top-12 left-4 right-4 z-10 flex-row gap-2">
        <TouchableOpacity onPress={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 items-center justify-center shadow-md">
          <MaterialIcons name="arrow-back" size={20} color="gray" />
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingRight: 20 }}>
          <TouchableOpacity
            onPress={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-full mr-2 shadow-sm ${filter === 'all' ? 'bg-black dark:bg-white' : 'bg-white dark:bg-zinc-900'}`}
          >
            <Text className={`text-xs font-bold ${filter === 'all' ? 'text-white dark:text-black' : 'text-gray-900 dark:text-white'}`}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('historic')}
            className={`px-4 py-2.5 rounded-full mr-2 shadow-sm ${filter === 'historic' ? 'bg-black dark:bg-white' : 'bg-white dark:bg-zinc-900'}`}
          >
            <Text className={`text-xs font-bold ${filter === 'historic' ? 'text-white dark:text-black' : 'text-gray-900 dark:text-white'}`}>Históricos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('nature')}
            className={`px-4 py-2.5 rounded-full mr-2 shadow-sm ${filter === 'nature' ? 'bg-black dark:bg-white' : 'bg-white dark:bg-zinc-900'}`}
          >
            <Text className={`text-xs font-bold ${filter === 'nature' ? 'text-white dark:text-black' : 'text-gray-900 dark:text-white'}`}>Naturaleza</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Bottom Sheet for Active POI */}
      {activePoi && (
        <View className="absolute bottom-6 left-4 right-4 bg-white dark:bg-zinc-900 rounded-[2rem] p-5 shadow-2xl animate-fade-in-up border border-gray-100 dark:border-gray-800">
          <View className="flex-row gap-4">
            <View className="relative w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
              {/* Placeholder or actual image if available in POI data */}
              <View className="w-full h-full bg-gray-200 items-center justify-center">
                <MaterialIcons name="image" size={24} color="gray" />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{activePoi.title}</Text>
              <Text className="text-xs text-gray-500 mb-3" numberOfLines={2}>{activePoi.description}</Text>

              <TouchableOpacity
                onPress={() => navigate(`/poi/${activePoi.id}`)}
                className="bg-primary self-start px-4 py-2 rounded-xl"
              >
                <Text className="text-xs font-bold text-black">{t('circuit.details')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="absolute top-2 right-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-full"
            onPress={() => setActivePoi(null)}
          >
            <MaterialIcons name="close" size={16} color="gray" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
import { ScrollView } from 'react-native';

export default MapOverview;

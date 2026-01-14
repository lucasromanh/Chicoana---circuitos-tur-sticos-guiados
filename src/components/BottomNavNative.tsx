import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@/contexts/UserContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/routerAdapter';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BottomNavNative: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { t } = useUser();

  // Hide bottom nav on Splash and Active Navigation
  if (route.name === 'Splash' || route.name === 'ActiveNavigation') return null;

  const isActive = (routeName: keyof RootStackParamList) => route.name === routeName;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-gray-800 pt-2 px-2 shadow-lg">
      <View className="flex-row items-end justify-around pb-3">
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          className="flex flex-col items-center justify-center gap-1 w-16 active:opacity-70"
        >
          <View className={`flex items-center justify-center w-12 h-8 rounded-full ${isActive('Home') ? 'bg-primary/20' : ''}`}>
            <MaterialIcons name="home" size={24} color={isActive('Home') ? '#10b981' : '#9ca3af'} />
          </View>
          <Text className={`text-[10px] ${isActive('Home') ? 'text-primary font-bold' : 'text-gray-400'}`}>
            {t('nav.home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('MapOverview')} 
          className="flex flex-col items-center justify-center gap-1 w-16 active:opacity-70"
        >
          <View className={`flex items-center justify-center w-12 h-8 rounded-full ${isActive('MapOverview') ? 'bg-primary/20' : ''}`}>
            <MaterialIcons name="map" size={24} color={isActive('MapOverview') ? '#10b981' : '#9ca3af'} />
          </View>
          <Text className={`text-[10px] ${isActive('MapOverview') ? 'text-primary font-bold' : 'text-gray-400'}`}>
            {t('nav.map')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Downloads')} 
          className="flex flex-col items-center justify-center gap-1 w-16 active:opacity-70"
        >
          <View className={`flex items-center justify-center w-12 h-8 rounded-full ${isActive('Downloads') ? 'bg-primary/20' : ''}`}>
            <MaterialIcons name="cloud-download" size={24} color={isActive('Downloads') ? '#10b981' : '#9ca3af'} />
          </View>
          <Text className={`text-[10px] ${isActive('Downloads') ? 'text-primary font-bold' : 'text-gray-400'}`}>
            {t('nav.offline')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')} 
          className="flex flex-col items-center justify-center gap-1 w-16 active:opacity-70"
        >
          <View className={`flex items-center justify-center w-12 h-8 rounded-full ${isActive('Settings') ? 'bg-primary/20' : ''}`}>
            <MaterialIcons name="settings" size={24} color={isActive('Settings') ? '#10b981' : '#9ca3af'} />
          </View>
          <Text className={`text-[10px] ${isActive('Settings') ? 'text-primary font-bold' : 'text-gray-400'}`}>
            {t('nav.settings')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavNative;

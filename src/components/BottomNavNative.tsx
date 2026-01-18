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
  const { t, settings } = useUser();

  // Hide bottom nav on Splash and Active Navigation
  if (route.name === 'Splash' || route.name === 'ActiveNavigation') return null;

  const isActive = (routeName: keyof RootStackParamList) => route.name === routeName;

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: settings.darkMode ? '#18181b' : '#ffffff', borderTopWidth: 1, borderTopColor: settings.darkMode ? '#27272a' : '#f3f4f6', paddingTop: 8, paddingHorizontal: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
      <View className="flex-row items-end justify-around pb-3">
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          className="flex flex-col items-center justify-center gap-1 w-16 active:opacity-70"
        >
          <View className={`flex items-center justify-center w-12 h-8 rounded-full ${isActive('Home') ? 'bg-primary/20' : ''}`}>
            <MaterialIcons name="home" size={24} color={isActive('Home') ? '#10b981' : '#9ca3af'} />
          </View>
          <Text style={{ fontSize: 10, color: isActive('Home') ? '#10b981' : (settings.darkMode ? '#9ca3af' : '#6b7280'), fontWeight: isActive('Home') ? 'bold' : 'normal' }}>
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
          <Text style={{ fontSize: 10, color: isActive('MapOverview') ? '#10b981' : (settings.darkMode ? '#9ca3af' : '#6b7280'), fontWeight: isActive('MapOverview') ? 'bold' : 'normal' }}>
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
          <Text style={{ fontSize: 10, color: isActive('Downloads') ? '#10b981' : (settings.darkMode ? '#9ca3af' : '#6b7280'), fontWeight: isActive('Downloads') ? 'bold' : 'normal' }}>
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
          <Text style={{ fontSize: 10, color: isActive('Settings') ? '#10b981' : (settings.darkMode ? '#9ca3af' : '#6b7280'), fontWeight: isActive('Settings') ? 'bold' : 'normal' }}>
            {t('nav.settings')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavNative;

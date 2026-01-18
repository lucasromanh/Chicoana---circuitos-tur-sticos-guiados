import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions, ImageBackground } from 'react-native';
import { useNavigate } from '@/navigation/routerAdapter';
import { AVATARS } from '@/constants';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavNative from '@/components/BottomNavNative';

const { width } = Dimensions.get('window');

const Home: React.FC = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const { userName, isProfileComplete, userAvatarId, favorites, toggleFavorite, downloadedCircuits, t, circuits, settings } = useUser();

  // States for functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive Avatar
  const currentAvatar = AVATARS.find(a => a.id === userAvatarId) || AVATARS[0];

  // Filtering Logic
  const filteredCircuits = useMemo(() => {
    return circuits.filter((circuit: any) => {
      const matchesSearch = circuit.title.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = true;
      if (selectedCategory === 'Todos') {
        matchesCategory = true;
      } else if (selectedCategory === 'Favoritos') {
        matchesCategory = favorites.includes(circuit.id);
      } else {
        matchesCategory = circuit.category === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, favorites, circuits]);

  // Dynamic Title Logic
  const getSectionTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;

    switch (selectedCategory) {
      case 'Todos': return t('home.featured');
      case 'Favoritos': return t('home.favorites');
      case 'Históricos': return t('home.cats.hist');
      case 'Naturaleza': return t('home.cats.nat');
      case 'Gastronomía': return t('home.cats.gastro');
      case 'Cultura': return t('home.cats.cult');
      default: return selectedCategory;
    }
  };

  const categories = [
    { id: 'Todos', label: t('home.cats.all') },
    { id: 'Favoritos', label: t('home.cats.fav') },
    { id: 'Históricos', label: t('home.cats.hist') },
    { id: 'Naturaleza', label: t('home.cats.nat') },
    { id: 'Gastronomía', label: t('home.cats.gastro') },
    { id: 'Cultura', label: t('home.cats.cult') }
  ];

  console.log('🎨 Renderizando Home con imagen de fondo');

  return (
    <View style={{ flex: 1, backgroundColor: settings.darkMode ? '#09090b' : '#f9fafb' }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className={`w-10 h-10 rounded-full ${currentAvatar.bg} overflow-hidden border border-white shadow-sm items-center justify-center`}>
                <Text className="text-xl">{currentAvatar.icon}</Text>
              </View>
              <View>
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('home.welcome')}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#111827', lineHeight: 18 }}>
                  {isProfileComplete ? `${t('home.hello')}, ${userName}` : `${t('home.hello')}, ${t('home.traveler')}`}
                </Text>
              </View>
            </View>
            <View className="relative">
              <TouchableOpacity
                onPress={() => setShowNotifications(!showNotifications)}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                  borderWidth: 1,
                  borderColor: settings.darkMode ? '#27272a' : '#f3f4f6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2
                }}
              >
                <MaterialIcons name="notifications" size={20} color="gray" />
                <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </TouchableOpacity>

              {/* Notifications Dropdown (Simulated) */}
              {showNotifications && (
                <View style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: 48, 
                  width: 256, 
                  backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  borderWidth: 1,
                  borderColor: settings.darkMode ? '#27272a' : '#f3f4f6',
                  zIndex: 50,
                  padding: 8
                }}>
                  <Text className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">{t('home.notif_title')}</Text>
                  <View className="flex-row gap-2 p-2 bg-gray-50/50 dark:bg-white/5 rounded-lg">
                    <MaterialIcons name="event" size={16} color="#80EC13" />
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: settings.darkMode ? '#ffffff' : '#000000' }}>{t('home.notif_event')}</Text>
                      <Text className="text-[10px] text-gray-500">{t('home.notif_desc')}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Search Bar */}
          <View className="relative mb-6">
            <View className="absolute left-3 top-3 z-10">
              <MaterialIcons name="search" size={20} color="#9ca3af" />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('home.search')}
              placeholderTextColor="#9ca3af"
              className="w-full bg-white dark:bg-zinc-900 py-3 pl-10 pr-12 rounded-2xl text-sm shadow-sm border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                className="absolute right-10 top-3"
              >
                <MaterialIcons name="close" size={18} color="gray" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity className="absolute right-2 top-2 p-1.5 bg-primary rounded-xl shadow-sm">
              <MaterialIcons name="tune" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories - Flex Wrap Layout instead of Grid */}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2.5 rounded-xl transition-all shadow-sm flex-row items-center justify-center gap-1 min-w-[30%] ${selectedCategory === cat.id
                ? 'bg-gray-900 text-white shadow-black/10'
                : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-700'
                }`}
            >
              {cat.id === 'Favoritos' && (
                <MaterialIcons name="favorite" size={14} color="#ef4444" />
              )}
              <Text className={`text-[11px] font-bold ${selectedCategory === cat.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-lg font-bold dark:text-white">
            {getSectionTitle()}
          </Text>
          {!searchQuery && selectedCategory === 'Todos' && (
            <TouchableOpacity>
              <Text className="text-xs font-bold text-primary-dark dark:text-primary">{t('home.view_all')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Circuit List */}
        <View className="gap-6">
          {filteredCircuits.length > 0 ? (
            filteredCircuits.map((circuit: any) => {
              const isFav = favorites.includes(circuit.id);
              const isDownloaded = downloadedCircuits.includes(circuit.id);

              return (
                <View
                  key={circuit.id}
                  style={{
                    backgroundColor: settings.darkMode ? '#18181b' : '#ffffff',
                    borderRadius: 32,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    borderWidth: 1,
                    borderColor: settings.darkMode ? '#27272a' : '#f3f4f6'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      console.log('🏠 Home - Navegando a circuito:', circuit.id, circuit.title);
                      navigate(`/circuit/${circuit.id}`);
                    }}
                    activeOpacity={0.9}
                  >
                    <View className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                      <Image
                        source={{ uri: circuit.image }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                        onError={(e) => console.log('Error cargando imagen:', circuit.image, e.nativeEvent.error)}
                        onLoad={() => console.log('Imagen cargada:', circuit.image)}
                      />

                      {/* Favorite Button */}
                      <TouchableOpacity
                        onPress={() => {
                          console.log('Botón favorito presionado, circuit id:', circuit.id);
                          toggleFavorite(circuit.id);
                        }}
                        activeOpacity={0.7}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isFav ? '#ef4444' : 'rgba(255, 255, 255, 0.3)',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                        }}
                      >
                        <MaterialIcons name={isFav ? "favorite" : "favorite-border"} size={18} color="white" />
                      </TouchableOpacity>

                      {isDownloaded && (
                        <View className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex-row items-center gap-1">
                          <MaterialIcons name="check-circle" size={10} color="#80EC13" />
                          <Text className="text-white text-[10px] font-bold">Offline</Text>
                        </View>
                      )}
                    </View>

                    <View className="px-1">
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: settings.darkMode ? '#ffffff' : '#111827', lineHeight: 22, marginBottom: 4 }}>{circuit.title}</Text>
                      <View className="flex-row items-center gap-4 mb-3">
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="hiking" size={14} color="gray" />
                          <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">{circuit.distance} {t('circuit.distance')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="schedule" size={14} color="gray" />
                          <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">{circuit.duration} {t('circuit.duration')}</Text>
                        </View>
                      </View>

                      <View className="w-full py-3 bg-[#e8fcc2] dark:bg-primary/20 rounded-xl flex-row items-center justify-center gap-1">
                        <Text className="text-gray-900 dark:text-white text-xs font-bold">{t('circuit.details')}</Text>
                        <MaterialIcons name="arrow-forward" size={14} color="black" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View className="py-12 items-center">
              <MaterialIcons name={selectedCategory === 'Favoritos' ? 'heart-broken' : 'search-off'} size={40} color="#9ca3af" />
              <Text className="text-sm text-gray-400 mt-2">
                {selectedCategory === 'Favoritos'
                  ? t('home.favorites') + ' ' + t('home.no_results')
                  : t('home.no_results')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNavNative />
    </View>
  );
};

export default Home;

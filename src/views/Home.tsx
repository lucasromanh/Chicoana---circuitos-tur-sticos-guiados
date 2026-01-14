import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigate } from '@/navigation/routerAdapter';
import { AVATARS } from '@/constants';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Home: React.FC = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const { userName, isProfileComplete, userAvatarId, favorites, toggleFavorite, downloadedCircuits, t, circuits } = useUser();

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

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
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
                <Text className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                  {isProfileComplete ? `${t('home.hello')}, ${userName}` : `${t('home.hello')}, ${t('home.traveler')}`}
                </Text>
              </View>
            </View>
            <View className="relative">
              <TouchableOpacity
                onPress={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 items-center justify-center shadow-sm"
              >
                <MaterialIcons name="notifications" size={20} color="gray" />
                <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </TouchableOpacity>

              {/* Notifications Dropdown (Simulated) */}
              {showNotifications && (
                <View className="absolute right-0 top-12 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 p-2">
                  <Text className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">{t('home.notif_title')}</Text>
                  <View className="flex-row gap-2 p-2 bg-gray-50/50 dark:bg-white/5 rounded-lg">
                    <MaterialIcons name="event" size={16} color="#80EC13" />
                    <View>
                      <Text className="text-xs font-bold dark:text-white">{t('home.notif_event')}</Text>
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
                <TouchableOpacity
                  key={circuit.id}
                  onPress={() => navigate(`/circuit/${circuit.id}`)}
                  activeOpacity={0.9}
                  className="group bg-white dark:bg-zinc-900 rounded-[2rem] p-3 shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <View className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                    <Image
                      source={{ uri: circuit.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />

                    {/* Favorite Button */}
                    <View className="absolute top-3 right-3">
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFavorite(circuit.id);
                        }}
                        className={`w-8 h-8 rounded-full items-center justify-center shadow-sm ${isFav ? 'bg-red-500' : 'bg-white/30'}`}
                      >
                        <MaterialIcons name={isFav ? "favorite" : "favorite-border"} size={18} color="white" />
                      </TouchableOpacity>
                    </View>

                    {isDownloaded && (
                      <View className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex-row items-center gap-1">
                        <MaterialIcons name="check-circle" size={10} color="#80EC13" />
                        <Text className="text-white text-[10px] font-bold">Offline</Text>
                      </View>
                    )}
                  </View>

                  <View className="px-1">
                    <Text className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">{circuit.title}</Text>
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
    </View>
  );
};

export default Home;

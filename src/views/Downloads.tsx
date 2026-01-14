import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigate } from '@/navigation/routerAdapter';
import { AVAILABLE_DOWNLOADS } from '@/constants';
import { useUser } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavNative from '@/components/BottomNavNative';

const Downloads: React.FC = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const { downloadedCircuits, removeDownload, simulateDownload, t, circuits } = useUser();

  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [needsUpdate, setNeedsUpdate] = useState<string[]>(['ruta-tabaco']);

  // Toast simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allItems = useMemo(() => {
    const circuitItems = circuits.map((c: any) => ({
      id: c.id,
      title: c.title,
      size: c.downloadSize,
      description: `Ver ${c.version}`,
      image: c.image,
      type: 'circuit' as const,
      icon: 'map'
    }));

    const extraItems = AVAILABLE_DOWNLOADS.map(e => {
      let localizedTitle = e.title;
      let localizedDesc = e.description;

      if (e.id === 'chicoana-map-pack') {
        localizedTitle = t('downloads.extras.map_pack');
        localizedDesc = t('downloads.extras.map_pack_desc');
      } else if (e.id === 'audio-pack-es') {
        localizedTitle = t('downloads.extras.audio_pack');
        localizedDesc = t('downloads.extras.audio_pack_desc');
      } else if (e.id === 'tamales-fest') {
        localizedTitle = t('downloads.extras.tamal_guide');
        localizedDesc = t('downloads.extras.tamal_guide_desc');
      } else if (e.id === 'trekking-maps') {
        localizedTitle = t('downloads.extras.trekking');
        localizedDesc = t('downloads.extras.trekking_desc');
      }

      return {
        id: e.id,
        title: localizedTitle,
        size: e.size,
        description: localizedDesc,
        image: null,
        type: 'extra' as const,
        icon: e.icon
      };
    });

    return [...circuitItems, ...extraItems];
  }, [circuits, t]);

  const downloadedItems = allItems.filter(item => downloadedCircuits.includes(item.id));
  const availableItems = allItems.filter(item => !downloadedCircuits.includes(item.id));

  const handleDownload = async (id: string) => {
    setLoadingItems(prev => [...prev, id]);
    await simulateDownload(id);
    setLoadingItems(prev => prev.filter(i => i !== id));
    showToast('¡Descarga completada!');
  };

  const handleUpdate = async (id: string) => {
    setLoadingItems(prev => [...prev, id]);
    await simulateDownload(id);
    setLoadingItems(prev => prev.filter(i => i !== id));
    setNeedsUpdate(prev => prev.filter(i => i !== id));
    showToast('Actualizado correctamente');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar Descarga',
      '¿Eliminar esta descarga del dispositivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeDownload(id);
            setNeedsUpdate(prev => prev.filter(i => i !== id));
            showToast('Elemento eliminado');
          }
        }
      ]
    );
  };

  const handleOpen = (item: typeof allItems[0]) => {
    if (item.type === 'circuit') {
      navigate(`/circuit/${item.id}`);
    } else {
      if (item.id === 'chicoana-map-pack' || item.id === 'trekking-maps') {
        navigate('/map');
      } else if (item.id === 'audio-pack-es') {
        showToast('Paquete de voces activo 🎧');
      } else {
        showToast(`Abriendo ${item.title}...`);
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => navigate(-1)} className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <MaterialIcons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{t('downloads.title')}</Text>
          <TouchableOpacity onPress={() => navigate('/settings')}>
            <Text className="text-sm font-bold text-gray-500">{t('nav.settings')}</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Usage Card */}
        <View className="mb-8 bg-white dark:bg-zinc-900 p-5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t('downloads.storage')}</Text>
          <View className="flex-row justify-between items-baseline mb-2">
            <Text className="text-2xl font-black text-gray-900 dark:text-white">
              {(downloadedItems.length * 0.15 + 0.5).toFixed(1)} GB
            </Text>
            <Text className="text-xs font-bold text-primary-dark dark:text-primary">45 GB {t('downloads.free_space')}</Text>
          </View>
          <Text className="text-[10px] font-medium text-gray-400 mb-3">{t('downloads.used_by')}</Text>
          <View className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex-row mb-2">
            <View className="h-full bg-[#80ec13]" style={{ width: `${(downloadedItems.length * 5) + 10}%` }} />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[9px] font-bold text-gray-300">0 GB</Text>
            <Text className="text-[9px] font-bold text-gray-300">128 GB</Text>
          </View>
        </View>

        {/* Downloaded Items */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{t('downloads.downloaded')}</Text>
          <View className="bg-[#e0fec0] px-2 py-0.5 rounded-md">
            <Text className="text-green-800 text-[10px] font-bold">{downloadedItems.length} items</Text>
          </View>
        </View>

        <View className="gap-6 mb-8">
          {downloadedItems.length === 0 ? (
            <View className="items-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
              <MaterialIcons name="cloud-off" size={40} color="#d1d5db" />
              <Text className="text-sm text-gray-400 mt-2">{t('downloads.empty')}</Text>
            </View>
          ) : (
            downloadedItems.map(item => {
              const isUpdating = loadingItems.includes(item.id);
              const updateAvailable = needsUpdate.includes(item.id);

              return (
                <View key={item.id} className="bg-white dark:bg-zinc-900 p-3 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  {item.type === 'circuit' && item.image ? (
                    <View className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                      <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      {updateAvailable && !isUpdating && (
                        <View className="absolute top-3 right-3 bg-[#fcefb4] px-2 py-1 rounded-lg flex-row items-center gap-1 shadow-sm">
                          <MaterialIcons name="update" size={12} color="#9a3412" />
                          <Text className="text-orange-800 text-[10px] font-bold">{t('downloads.version_update')} v1.2</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-4 p-2 mb-2">
                      <View className="w-12 h-12 bg-[#f0f9ff] dark:bg-blue-900/20 rounded-xl items-center justify-center">
                        {/* @ts-ignore */}
                        <MaterialIcons name={item.icon || 'star'} size={24} color="#3b82f6" />
                      </View>
                      {updateAvailable && (
                        <View className="bg-[#fcefb4] px-2 py-1 rounded-lg ml-auto">
                          <Text className="text-orange-800 text-[10px] font-bold">{t('downloads.version_update')}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View className="px-1 pb-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="font-bold text-base text-gray-900 dark:text-white flex-1">{item.title}</Text>
                      {!isUpdating && !updateAvailable && (
                        <MaterialIcons name="check-circle" size={18} color="#22c55e" />
                      )}
                    </View>
                    <Text className="text-[11px] font-medium text-gray-400 mb-4">{item.size} • {item.description}</Text>

                    <View className="flex-row gap-2">
                      {updateAvailable ? (
                        <TouchableOpacity
                          onPress={() => handleUpdate(item.id)}
                          disabled={isUpdating}
                          className="flex-1 bg-black dark:bg-white py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
                        >
                          {isUpdating ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <MaterialIcons name="sync" size={18} color="white" />
                          )}
                          <Text className="text-white dark:text-black text-xs font-bold">{isUpdating ? t('downloads.updating') : t('downloads.update')}</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleOpen(item)}
                          className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
                        >
                          <MaterialIcons name={item.id === 'audio-pack-es' ? 'play-circle' : 'map'} size={18} color="black" />
                          <Text className="text-black text-xs font-bold">{t('downloads.open')}</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        className="w-10 bg-red-50 dark:bg-red-900/10 rounded-xl items-center justify-center"
                      >
                        <MaterialIcons name="delete" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Available Section */}
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('downloads.available')}</Text>
        <View className="gap-3">
          {availableItems.length === 0 ? (
            <Text className="text-sm text-gray-400 text-center py-4">¡Todo está descargado! 🎉</Text>
          ) : (
            availableItems.map(item => {
              const isLoading = loadingItems.includes(item.id);
              return (
                <View key={item.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-12 h-12 bg-[#f0f9ff] dark:bg-blue-900/20 rounded-xl items-center justify-center shrink-0">
                      {item.type === 'circuit' && item.image ? (
                        <Image source={{ uri: item.image }} className="w-full h-full rounded-xl opacity-80" resizeMode="cover" />
                      ) : (
                        // @ts-ignore
                        <MaterialIcons name={item.icon || 'cloud-download'} size={24} color="#3b82f6" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-gray-900 dark:text-white" numberOfLines={1}>{item.title}</Text>
                      <Text className="text-[10px] font-bold text-gray-400 mt-0.5">{item.size} • {item.description}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDownload(item.id)}
                    disabled={isLoading}
                    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 items-center justify-center"
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#80EC13" />
                    ) : (
                      <MaterialIcons name="download" size={20} color="gray" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      {toastMessage && (
        <View className="absolute top-12 left-0 right-0 items-center z-50">
          <View className="bg-black/80 px-4 py-2 rounded-full flex-row items-center gap-2">
            <MaterialIcons name="check-circle" size={16} color="white" />
            <Text className="text-white text-xs font-bold">{toastMessage}</Text>
          </View>
        </View>
      )}
      <BottomNavNative />
    </View>
  );
};

export default Downloads;

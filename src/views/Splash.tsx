import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigate } from '@/navigation/routerAdapter';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showPermissionCard, setShowPermissionCard] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Fase 1: Carga hasta 50%
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 50) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setShowPermissionCard(true);
          return 50;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleEnableLocation = () => {
    setShowPermissionCard(false);

    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Fase 2: 50% a 100%
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeout(() => navigate('/home'), 300);
            return 100;
          }
          return prev + 4;
        });
      }, 10);
    }, 300);
  };

  return (
    <View className="relative h-full w-full bg-gray-900">

      {/* CAPA 1: FONDO (Absoluta, sin Flexbox interfiriendo) */}
      <View className="absolute inset-0 z-0">
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1080&auto=format&fit=crop" }}
          className="w-full h-full opacity-100"
          resizeMode="cover"
        />
        {/* Gradiente superior suave para el logo */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          className="absolute top-0 left-0 w-full h-1/2"
        />
        {/* Gradiente inferior fuerte para los controles */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.8)', '#ffffff']}
          className="absolute bottom-0 left-0 w-full h-2/3"
        />
      </View>

      {/* CAPA 2: CONTENIDO (Relativa, Z-Index positivo) */}
      <View className="relative z-10 h-full flex flex-col justify-between pt-16 pb-12 px-6">

        {/* Header Logo */}
        <View className="flex flex-col items-center mt-8">
          <View className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-md shadow-black/30 rotate-3">
            <MaterialIcons name="landscape" size={48} color="black" />
          </View>
          <Text className="text-5xl font-extrabold text-white mb-2 drop-shadow-md tracking-tight">
            Chicoana
          </Text>
          <View className="bg-white/20 border border-white/30 px-4 py-1.5 rounded-full">
            <Text className="text-white font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
              Circuitos Guiados
            </Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View className="w-full flex flex-col items-center pb-4">

          {/* Tarjeta de Permisos */}
          {showPermissionCard && (
            <View className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
              <View className="flex-row gap-4 mb-5 items-start">
                <View className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <MaterialIcons name="location-off" size={24} color="#ef4444" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 text-base">Acceso GPS Requerido</Text>
                  <Text className="text-sm text-gray-500 leading-relaxed mt-1">
                    Para activar el ruteo offline y las alertas de proximidad, necesitamos tu ubicación.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleEnableLocation}
                className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-md shadow-primary/20"
              >
                <MaterialIcons name="near-me" size={20} color="black" />
                <Text className="text-black font-bold text-sm">Habilitar Ahora</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Barra de Progreso */}
          <View className="w-full mb-6 px-1">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Cargando mapa offline...</Text>
              <Text className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">{Math.min(100, Math.round(progress))}%</Text>
            </View>
            <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </View>
          </View>

          {/* Badge de Estado */}
          <View className="bg-white/60 border border-white px-4 py-2 rounded-full flex-row items-center gap-2 shadow-sm">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Text className="text-[11px] font-bold text-gray-800">Sistema Offline Activo</Text>
          </View>
        </View>

      </View>
    </View>
  );
};

export default Splash;

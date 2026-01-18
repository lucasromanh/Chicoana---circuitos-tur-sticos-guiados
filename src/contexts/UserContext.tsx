import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CIRCUITS } from '@/constants';
import { AppRoute, Circuit, LanguageCode } from '@/types';
import { UI_TRANSLATIONS, CIRCUIT_DATA_TRANSLATIONS } from '@/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  darkMode: boolean;
  wifiOnly: boolean;
  voiceInstructions: boolean;
  backgroundGps: boolean;
  language: LanguageCode;
}

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  isProfileComplete: boolean;
  userAvatarId: string;
  setUserAvatarId: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  downloadedCircuits: string[];
  simulateDownload: (id: string) => Promise<void>;
  removeDownload: (id: string) => void;
  visitedPois: string[];
  markPoiAsVisited: (id: string) => void;
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => void;
  resetTutorial: () => void;
  // I18n
  t: (key: string) => string;
  circuits: Circuit[]; // Localized circuits
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userAvatarId, setUserAvatarIdState] = useState('gaucho');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloadedCircuits, setDownloadedCircuits] = useState<string[]>(['historic-center', 'ruta-tabaco']);
  const [visitedPois, setVisitedPois] = useState<string[]>([]);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    wifiOnly: true,
    voiceInstructions: true,
    backgroundGps: true,
    language: 'es'
  });

  useEffect(() => {
    // Cargar datos guardados
    const loadData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('chicoana_user_name');
        const savedAvatar = await AsyncStorage.getItem('chicoana_user_avatar');
        const savedFavorites = await AsyncStorage.getItem('chicoana_user_favorites');
        const savedDownloads = await AsyncStorage.getItem('chicoana_downloads');
        const savedVisited = await AsyncStorage.getItem('chicoana_visited_pois');
        const savedSettings = await AsyncStorage.getItem('chicoana_settings');

        if (savedName) {
          setUserNameState(savedName);
          setIsProfileComplete(true);
        }
        if (savedAvatar) {
          setUserAvatarIdState(savedAvatar);
        }
        if (savedFavorites) {
          try { setFavorites(JSON.parse(savedFavorites)); } catch (e) { }
        }
        if (savedDownloads) {
          try { setDownloadedCircuits(JSON.parse(savedDownloads)); } catch (e) { }
        }
        if (savedVisited) {
          try { setVisitedPois(JSON.parse(savedVisited)); } catch (e) { }
        }
        if (savedSettings) {
          try {
            setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
          } catch (e) { }
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };
    loadData();
  }, []);

  const setUserName = async (name: string) => {
    setUserNameState(name);
    try {
      if (name.trim().length > 0) {
        await AsyncStorage.setItem('chicoana_user_name', name);
        setIsProfileComplete(true);
      } else {
        await AsyncStorage.removeItem('chicoana_user_name');
        setIsProfileComplete(false);
      }
    } catch (e) { console.error(e); }
  };

  const setUserAvatarId = async (id: string) => {
    setUserAvatarIdState(id);
    try {
      await AsyncStorage.setItem('chicoana_user_avatar', id);
    } catch (e) { console.error(e); }
  };

  const toggleFavorite = async (id: string) => {
    console.log('toggleFavorite llamado con id:', id);
    setFavorites(prev => {
      console.log('Favoritos actuales:', prev);
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(favId => favId !== id);
      } else {
        next = [...prev, id];
      }
      console.log('Nuevos favoritos:', next);
      AsyncStorage.setItem('chicoana_user_favorites', JSON.stringify(next)).catch(console.error);
      return next;
    });
  };

  const simulateDownload = async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setDownloadedCircuits(prev => {
          if (!prev.includes(id)) {
            const updated = [...prev, id];
            AsyncStorage.setItem('chicoana_downloads', JSON.stringify(updated)).catch(console.error);
            return updated;
          }
          return prev;
        });
        resolve();
      }, 2000);
    });
  };

  const removeDownload = (id: string) => {
    setDownloadedCircuits(prev => {
      const updated = prev.filter(item => item !== id);
      AsyncStorage.setItem('chicoana_downloads', JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  };

  const markPoiAsVisited = (id: string) => {
    setVisitedPois(prev => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        AsyncStorage.setItem('chicoana_visited_pois', JSON.stringify(updated)).catch(console.error);
        return updated;
      }
      return prev;
    });
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      AsyncStorage.setItem('chicoana_settings', JSON.stringify(newSettings)).catch(console.error);
      return newSettings;
    });
  };

  const resetTutorial = () => {
    AsyncStorage.removeItem('chicoana_user_name').catch(console.error);
    setUserNameState('');
    setIsProfileComplete(false);
  };

  // --- I18N LOGIC ---

  // Helper to get nested properties safely (e.g. 'home.welcome')
  const t = (path: string): string => {
    const lang = settings.language;
    const keys = path.split('.');
    let current: any = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['es'];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Spanish if translation missing
        let fallback: any = UI_TRANSLATIONS['es'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey]) fallback = fallback[fKey];
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    // If current is an object, return the path (don't render objects)
    return typeof current === 'string' ? current : path;
  };

  // Localized Circuits
  const circuits = CIRCUITS.map(circuit => {
    const lang = settings.language;
    if (lang === 'es') return circuit; // Default

    const translations = CIRCUIT_DATA_TRANSLATIONS[lang]?.[circuit.id];
    if (translations) {
      // Map POIs if translations exist
      const localizedPois = circuit.pois.map(poi => {
        const poiTrans = translations.pois?.[poi.id];
        if (poiTrans) {
          return { ...poi, title: poiTrans.title || poi.title, description: poiTrans.description || poi.description };
        }
        return poi;
      });

      return {
        ...circuit,
        title: translations.title || circuit.title,
        description: translations.description || circuit.description,
        pois: localizedPois
      };
    }
    return circuit;
  });

  return (
    <UserContext.Provider value={{
      userName,
      setUserName,
      isProfileComplete,
      userAvatarId,
      setUserAvatarId,
      favorites,
      toggleFavorite,
      downloadedCircuits,
      simulateDownload,
      removeDownload,
      visitedPois,
      markPoiAsVisited,
      settings,
      updateSetting,
      resetTutorial,
      t,
      circuits
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

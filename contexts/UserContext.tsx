
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AVATARS, CIRCUITS } from '../constants';
import { AppRoute, Circuit, LanguageCode } from '../types';
import { UI_TRANSLATIONS, CIRCUIT_DATA_TRANSLATIONS } from '../translations';

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
    const savedName = localStorage.getItem('chicoana_user_name');
    const savedAvatar = localStorage.getItem('chicoana_user_avatar');
    const savedFavorites = localStorage.getItem('chicoana_user_favorites');
    const savedDownloads = localStorage.getItem('chicoana_downloads');
    const savedVisited = localStorage.getItem('chicoana_visited_pois');
    const savedSettings = localStorage.getItem('chicoana_settings');

    if (savedName) {
      setUserNameState(savedName);
      setIsProfileComplete(true);
    }
    if (savedAvatar) {
      setUserAvatarIdState(savedAvatar);
    }
    if (savedFavorites) {
      try { setFavorites(JSON.parse(savedFavorites)); } catch (e) {}
    }
    if (savedDownloads) {
      try { setDownloadedCircuits(JSON.parse(savedDownloads)); } catch (e) {}
    }
    if (savedVisited) {
      try { setVisitedPois(JSON.parse(savedVisited)); } catch (e) {}
    }
    if (savedSettings) {
      try { 
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) })); 
      } catch (e) {}
    }
  }, []);

  // Efecto para aplicar Modo Oscuro
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const setUserName = (name: string) => {
    setUserNameState(name);
    if (name.trim().length > 0) {
      localStorage.setItem('chicoana_user_name', name);
      setIsProfileComplete(true);
    } else {
      localStorage.removeItem('chicoana_user_name');
      setIsProfileComplete(false);
    }
  };

  const setUserAvatarId = (id: string) => {
    setUserAvatarIdState(id);
    localStorage.setItem('chicoana_user_avatar', id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(id)) {
        newFavorites = prev.filter(favId => favId !== id);
      } else {
        newFavorites = [...prev, id];
      }
      localStorage.setItem('chicoana_user_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const simulateDownload = async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setDownloadedCircuits(prev => {
          if (!prev.includes(id)) {
            const updated = [...prev, id];
            localStorage.setItem('chicoana_downloads', JSON.stringify(updated));
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
      localStorage.setItem('chicoana_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const markPoiAsVisited = (id: string) => {
    setVisitedPois(prev => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        localStorage.setItem('chicoana_visited_pois', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('chicoana_settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const resetTutorial = () => {
    localStorage.removeItem('chicoana_user_name');
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
        return fallback || path;
      }
    }
    return current as string;
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

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AVATARS } from '../constants';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  isProfileComplete: boolean;
  userAvatarId: string;
  setUserAvatarId: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userAvatarId, setUserAvatarIdState] = useState('gaucho');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Cargar datos guardados
    const savedName = localStorage.getItem('chicoana_user_name');
    const savedAvatar = localStorage.getItem('chicoana_user_avatar');
    const savedFavorites = localStorage.getItem('chicoana_user_favorites');

    if (savedName) {
      setUserNameState(savedName);
      setIsProfileComplete(true);
    }
    if (savedAvatar) {
      setUserAvatarIdState(savedAvatar);
    }
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Error parsing favorites", e);
      }
    }
  }, []);

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

  return (
    <UserContext.Provider value={{ 
      userName, 
      setUserName, 
      isProfileComplete, 
      userAvatarId, 
      setUserAvatarId,
      favorites,
      toggleFavorite
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
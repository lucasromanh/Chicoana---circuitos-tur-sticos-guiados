import { useColorScheme as useRNColorScheme } from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const { settings } = useUser();
  
  // Si darkMode está activado en settings, devolver 'dark', sino usar el del sistema
  const colorScheme = settings.darkMode ? 'dark' : (systemColorScheme || 'light');
  
  return colorScheme;
}

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    // NativeWind v2 usa el sistema de temas de React Native
    // No necesitamos manipular clases manualmente
  }, [colorScheme]);
  
  return children;
}

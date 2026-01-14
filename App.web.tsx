import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Splash from '@/views/Splash';
import Home from '@/views/Home';
import CircuitDetail from '@/views/CircuitDetail';
import MapOverview from '@/views/MapOverview';
import ActiveNavigation from '@/views/ActiveNavigation';
import PoiDetail from '@/views/PoiDetail';
import Downloads from '@/views/Downloads';
import Settings from '@/views/Settings';
import { UserProvider } from '@/contexts/UserContext';

// Declaración de tipo para Tailwind CDN
declare global {
  interface Window {
    tailwind?: {
      config: any;
    };
  }
}

// Inyectar Tailwind CSS y configuración
if (typeof document !== 'undefined') {
  // Agregar Tailwind CSS CDN
  const tailwindScript = document.createElement('script');
  tailwindScript.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(tailwindScript);

  // Configurar Tailwind
  tailwindScript.onload = () => {
    if (window.tailwind) {
      window.tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#80ec13",
              "primary-dark": "#6bc410",
              "background-light": "#f7f8f6",
              "background-dark": "#0f0f0f",
              "surface-light": "#ffffff",
              "surface-dark": "#1c1c1e",
              "text-main": "#141811",
              "text-muted": "#758961",
            },
            fontFamily: {
              display: ["Plus Jakarta Sans", "sans-serif"],
              body: ["Noto Sans", "sans-serif"],
            },
            animation: {
              'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
            },
            keyframes: {
              fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(10px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
              }
            }
          },
        },
      };
    }
  };

  // Agregar Google Fonts
  const fontsLink = document.createElement('link');
  fontsLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;700&display=swap';
  fontsLink.rel = 'stylesheet';
  document.head.appendChild(fontsLink);

  // Agregar Material Symbols
  const materialLink = document.createElement('link');
  materialLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
  materialLink.rel = 'stylesheet';
  document.head.appendChild(materialLink);

  // Agregar estilos personalizados
  const style = document.createElement('style');
  style.textContent = `
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .filled {
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    body {
      -webkit-tap-highlight-color: transparent;
      overscroll-behavior-y: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom, 20px);
    }
  `;
  document.head.appendChild(style);
}
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Forzar Splash al cargar la app si no estamos en navegación activa
  useEffect(() => {
    // Si la app carga en Home (por refresh o URL directa), redirigir a Splash para la experiencia inicial
    // Se excluye '/navigation' por si el usuario recarga durante el viaje
    if (location.pathname !== '/' && location.pathname !== '/navigation') {
      navigate('/');
    }
  }, []);

  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/circuit/:id" element={<CircuitDetail />} />
        <Route path="/map" element={<MapOverview />} />
        <Route path="/navigation" element={<ActiveNavigation />} />
        <Route path="/poi/:id" element={<PoiDetail />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </UserProvider>
  );
};

export default App;
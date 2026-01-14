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
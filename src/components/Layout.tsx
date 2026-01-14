import React from 'react';
import { useLocation } from '@/navigation/routerAdapter';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isFullScreen = location.pathname === '/' || location.pathname === '/navigation';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white flex flex-col">
      <div className={`flex-1 ${isFullScreen ? 'p-0' : 'pb-24'}`}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
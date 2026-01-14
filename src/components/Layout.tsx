import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isFullScreen = location.pathname === '/' || location.pathname === '/navigation';

  return (
    <div className="min-h-screen w-full max-w-full bg-background-light dark:bg-background-dark text-text-main dark:text-white flex flex-col overflow-x-hidden">
      <div className={`flex-1 w-full ${isFullScreen ? 'p-0' : 'pb-24'}`}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
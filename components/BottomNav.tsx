
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useUser();

  // Hide bottom nav only on Splash and Active Navigation
  if (location.pathname === '/' || location.pathname === '/navigation') return null;

  const isActive = (path: string) => location.pathname === path ? "text-primary dark:text-primary font-bold" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 font-medium";
  const bgActive = (path: string) => location.pathname === path ? "bg-primary/20 text-primary-dark dark:text-primary" : "text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-800";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-2 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-end justify-around pb-2">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center justify-center gap-1 w-16 group active:scale-95 transition-transform">
          <div className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${bgActive('/home')}`}>
            <span className={`material-symbols-outlined text-[24px] ${location.pathname === '/home' ? 'filled' : ''}`}>home</span>
          </div>
          <span className={`text-[10px] ${isActive('/home')}`}>{t('nav.home')}</span>
        </button>

        <button onClick={() => navigate('/map')} className="flex flex-col items-center justify-center gap-1 w-16 group active:scale-95 transition-transform">
          <div className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${bgActive('/map')}`}>
            <span className={`material-symbols-outlined text-[24px] ${location.pathname === '/map' ? 'filled' : ''}`}>map</span>
          </div>
          <span className={`text-[10px] ${isActive('/map')}`}>{t('nav.map')}</span>
        </button>

         <button onClick={() => navigate('/downloads')} className="flex flex-col items-center justify-center gap-1 w-16 group active:scale-95 transition-transform">
          <div className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${bgActive('/downloads')}`}>
            <span className={`material-symbols-outlined text-[24px] ${location.pathname === '/downloads' ? 'filled' : ''}`}>offline_pin</span>
          </div>
          <span className={`text-[10px] ${isActive('/downloads')}`}>{t('nav.offline')}</span>
        </button>

        <button onClick={() => navigate('/settings')} className="flex flex-col items-center justify-center gap-1 w-16 group active:scale-95 transition-transform">
          <div className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${bgActive('/settings')}`}>
            <span className={`material-symbols-outlined text-[24px] ${location.pathname === '/settings' ? 'filled' : ''}`}>settings</span>
          </div>
          <span className={`text-[10px] ${isActive('/settings')}`}>{t('nav.settings')}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;

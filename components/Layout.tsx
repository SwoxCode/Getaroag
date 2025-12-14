import React, { useState, useEffect } from 'react';
import { Button } from './UI';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Helper for Bottom Nav Items
  const NavItem = ({ page, icon, label }: { page: string; icon: string; label: string }) => {
    const isActive = currentPage === page;
    return (
      <button 
        onClick={() => onNavigate(page)}
        className={`flex flex-col items-center justify-center w-16 space-y-1 transition-colors duration-200 z-10 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
      >
        <i className={`${icon} text-xl mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`}></i>
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-brand-600 tracking-tight cursor-pointer" onClick={() => onNavigate('home')}>
            {APP_NAME}
          </div>
          <div className="hidden lg:flex space-x-6">
            <button onClick={() => onNavigate('home')} className={`text-sm font-medium hover:text-brand-600 ${currentPage === 'home' ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300'}`}>Ana Sayfa</button>
            <button onClick={() => onNavigate('search')} className={`text-sm font-medium hover:text-brand-600 ${currentPage === 'search' ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300'}`}>Araçlar</button>
            <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600">Nasıl Çalışır?</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400">
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <Button variant="ghost" onClick={() => onNavigate('profile')}>Giriş Yap</Button>
          <Button onClick={() => onNavigate('list-car')}>Aracını Listele</Button>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur sticky top-0 z-40 shadow-sm transition-all">
        <div className="text-xl font-bold text-brand-600 tracking-tight" onClick={() => onNavigate('home')}>{APP_NAME}</div>
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[76px] bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl">
        <div className="relative flex justify-between items-center px-6 h-full pb-1">
            
            {/* Left Group */}
            <NavItem page="home" icon="fas fa-home" label="Akış" />
            <NavItem page="search" icon="fas fa-search" label="Ara" />

            {/* Center Spacer */}
            <div className="w-20 h-full flex items-end justify-center pointer-events-none"></div>

            {/* Right Group */}
            <NavItem page="bookings" icon="far fa-heart" label="Favoriler" />
            <NavItem page="profile" icon="far fa-user" label="Profil" />

            {/* Floating Action Button - Enlarged & Lowered */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <button 
                  onClick={() => onNavigate('list-car')}
                  className="w-[72px] h-[72px] bg-brand-600 hover:bg-brand-700 rounded-full text-white shadow-xl shadow-brand-500/40 flex items-center justify-center transition-transform active:scale-95 border-[6px] border-gray-50 dark:border-gray-900"
                >
                   <i className="fas fa-plus text-3xl"></i>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
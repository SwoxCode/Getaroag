import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { CarDetail } from './pages/CarDetail';
import { ListCar } from './pages/ListCar';
import { Profile } from './pages/Profile';

const App: React.FC = () => {
  // Always start at 'home' initially to satisfy "refresh edince anasayfa gelsin" request.
  const [route, setRoute] = useState({ page: 'home', params: {} as any });

  useEffect(() => {
    // 1. Force URL cleanup on mount (refresh)
    window.location.hash = '';

    // 2. Set up listener for subsequent navigations
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setRoute({ page: 'home', params: {} });
      } else {
        const parts = hash.split('/');
        const page = parts[0];
        const id = parts[1];
        setRoute({ page, params: { id } });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, params: any = {}) => {
    let hash = page;
    if (params.id) hash += `/${params.id}`;
    window.location.hash = hash;
  };

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <Home onSearch={(city) => navigate('search', { city })} onNavigate={navigate} />;
      case 'search':
        return <Search initialCity={route.params.city} onCarClick={(id) => navigate('car-detail', { id })} />;
      case 'car-detail':
        return <CarDetail carId={route.params.id} onBack={() => window.history.back()} />;
      case 'list-car':
        return <ListCar onNavigate={navigate} />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      case 'bookings':
        return <Profile onNavigate={navigate} />;
      default:
        return <Home onSearch={(city) => navigate('search', { city })} onNavigate={navigate} />;
    }
  };

  return (
    <Layout currentPage={route.page} onNavigate={(p) => navigate(p)}>
      {renderPage()}
    </Layout>
  );
};

export default App;
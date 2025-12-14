import React, { useState } from 'react';
import { Button, Input, Card } from '../components/UI';
import { SLOGAN_MAIN, SLOGAN_PASSIVE, CITIES } from '../constants';

interface HomeProps {
  onSearch: (city: string) => void;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSearch, onNavigate }) => {
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-32 md:pb-40">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center mb-4">
            {SLOGAN_MAIN}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-10 max-w-2xl mx-auto">
            İstediğin aracı bul, kirala ve yola çık. Sınır yok, sadece özgürlük var.
          </p>

          {/* Promotional Banner (App-like feel) */}
          <div className="max-w-3xl mx-auto mb-4 animate-fade-in-up">
            <div className="bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl p-0.5 shadow-lg mx-2 md:mx-0">
                <div className="bg-white dark:bg-gray-800 rounded-[10px] px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-xl">🎉</span>
                        <div>
                            <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">YENİ ÖZELLİK</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">İlk kiralamana özel <span className="font-bold text-brand-600">%20 indirim</span> kazandın!</p>
                        </div>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-brand-900/5 p-4 md:p-6 border border-gray-100 dark:border-gray-700 relative z-10">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Konum</label>
                <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-3 border border-transparent focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 transition-all">
                    <i className="fas fa-map-marker-alt text-brand-500 mr-3 text-lg"></i>
                    <input 
                        type="text" 
                        placeholder="Şehir veya ilçe ara..." 
                        className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tarih</label>
                <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <i className="far fa-calendar text-brand-500 mr-3 text-lg"></i>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium truncate">Tarih Seçin</span>
                </div>
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button type="submit" fullWidth size="lg" className="h-[46px] rounded-xl shadow-lg shadow-brand-500/30">Araç Bul</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex justify-between items-end mb-6">
             <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Popüler Şehirler</h2>
             <span className="text-brand-600 text-sm font-medium cursor-pointer">Tümünü gör</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
          {CITIES.map((c) => (
            <div 
              key={c.id} 
              className="group relative rounded-2xl overflow-hidden cursor-pointer min-w-[160px] md:min-w-[200px] aspect-[3/4] snap-start"
              onClick={() => onSearch(c.name)}
            >
              <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                  <span className="text-white/80 text-xs font-medium uppercase tracking-wider block mb-1">Türkiye</span>
                  <div className="text-white font-bold text-xl">{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Prop / Passive Income */}
      <section className="bg-brand-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex items-center justify-between gap-12">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 rounded-full text-xs font-bold mb-4">
                        GELİR ELDE ET
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {SLOGAN_PASSIVE}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Aracınızı güvenle kiralayın, masraflarınızı çıkarın ve ek gelir elde edin. Getaroag güvencesiyle aracınız emin ellerde.
                    </p>
                    <Button size="lg" onClick={() => onNavigate('list-car')} className="shadow-xl shadow-brand-600/20">Hemen Listele</Button>
                </div>
                <div className="md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop" alt="Araba Listele" className="rounded-3xl shadow-2xl w-full transform rotate-1 hover:rotate-0 transition-transform duration-500" />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};
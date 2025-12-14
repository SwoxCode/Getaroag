import React, { useState, useEffect } from 'react';
import { Car, FuelType, Transmission } from '../types';
import { getCars, FilterParams } from '../services/carService';
import { Button, Card, Badge, Select, Input } from '../components/UI';

interface SearchProps {
  initialCity?: string;
  onCarClick: (carId: string) => void;
}

export const Search: React.FC<SearchProps> = ({ initialCity, onCarClick }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); 
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filters State
  const [filters, setFilters] = useState<FilterParams>({ city: initialCity });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    setLoading(true);
    const data = await getCars(filters);
    setCars(data);
    setLoading(false);
  };

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // --- Components ---

  const CarListItem: React.FC<{ car: Car }> = ({ car }) => (
    <Card className={`flex flex-col md:flex-row hover:shadow-md transition-shadow cursor-pointer ${selectedCarId === car.id ? 'ring-2 ring-brand-500' : ''}`}>
      <div className="relative md:w-48 h-48 md:h-auto shrink-0" onClick={() => onCarClick(car.id)}>
        <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
            <Badge color="green">Müsait</Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-1" onClick={() => onCarClick(car.id)}>
        <div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{car.brand} {car.model}</h3>
                    <p className="text-sm text-gray-500">{car.year} • {car.type}</p>
                </div>
                <div className="flex items-center text-yellow-500 text-sm">
                    <i className="fas fa-star mr-1"></i> {car.owner.rating}
                </div>
            </div>
            <div className="mt-2 flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{car.fuelType}</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{car.transmission}</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{car.location.district}</span>
            </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
            <div>
                <span className="text-xl font-bold text-brand-600">₺{car.pricePerDay}</span>
                <span className="text-gray-500 text-sm"> / gün</span>
            </div>
        </div>
      </div>
    </Card>
  );

  const MapView = () => (
    <div className="w-full h-full bg-[#dbeafe] relative overflow-hidden rounded-lg md:rounded-none group">
        {/* Realistic Fallback Map Background Pattern */}
        <div 
            className="absolute inset-0 opacity-80 pointer-events-none"
            style={{
                backgroundImage: `
                    radial-gradient(circle at 10% 20%, #e0e7ff 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, #e0e7ff 0%, transparent 20%),
                    linear-gradient(#cbd5e1 1px, transparent 1px),
                    linear-gradient(90deg, #cbd5e1 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
            }}
        ></div>
        {/* Try Real Image again, if it loads it covers the pattern */}
        <div 
            className="absolute inset-0 opacity-100 pointer-events-none grayscale-[0.2]"
            style={{
                backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/Istanbul_map.png")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'contrast(1.1) brightness(1.05)',
                mixBlendMode: 'multiply'
            }}
        ></div>
        
        {/* Pins Layer */}
        {cars.map((car, idx) => {
            const isSelected = selectedCarId === car.id;
            
            // Simulating realistic distribution
            const topPos = 40 + (idx * 15) * (idx % 2 === 0 ? 1 : -0.8);
            const leftPos = 50 + (idx * 12) * (idx % 2 === 0 ? -1 : 0.9);

            return (
                <div
                    key={car.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? 'z-50' : 'z-10 hover:z-40'}`}
                    style={{
                        top: `${Math.max(10, Math.min(90, topPos))}%`, 
                        left: `${Math.max(10, Math.min(90, leftPos))}%`
                    }}
                >
                    {/* The Popup Bubble (Appears ABOVE the pin) */}
                    {isSelected && (
                         <div className="absolute bottom-[calc(100%+12px)] left-1/2 transform -translate-x-1/2 w-64 md:w-72 animate-fade-in-up origin-bottom z-50">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-black/20 p-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                                 <div className="relative h-32">
                                     <img src={car.images[0]} className="w-full h-full object-cover" alt="Car" />
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedCarId(null); }}
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs backdrop-blur"
                                     >
                                         <i className="fas fa-times"></i>
                                     </button>
                                     <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-black/70 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-gray-900 dark:text-white flex items-center">
                                         <i className="fas fa-star text-yellow-500 mr-1 text-[10px]"></i> {car.owner.rating}
                                     </div>
                                 </div>
                                 <div className="p-3">
                                     <h4 className="font-bold text-gray-900 dark:text-white truncate">{car.brand} {car.model}</h4>
                                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{car.type} • {car.location.district}</p>
                                     <div className="flex justify-between items-center">
                                         <div>
                                            <span className="font-bold text-lg text-brand-600">₺{car.pricePerDay}</span>
                                            <span className="text-xs text-gray-400">/gün</span>
                                         </div>
                                         <Button size="sm" onClick={() => onCarClick(car.id)} className="h-8 text-xs px-3">İncele</Button>
                                     </div>
                                 </div>
                            </div>
                            {/* Triangle Arrow */}
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 shadow-lg border-r border-b border-gray-100 dark:border-gray-700"></div>
                         </div>
                    )}

                    {/* The Pin (Price Pill) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedCarId(car.id); }}
                        className={`
                            flex items-center justify-center px-3 py-1.5 rounded-full font-bold shadow-md transition-transform
                            ${isSelected 
                                ? 'bg-brand-600 text-white scale-110 shadow-brand-500/40 ring-4 ring-white/30 dark:ring-black/30' 
                                : 'bg-white text-gray-900 hover:scale-105 hover:bg-gray-50 dark:bg-gray-800 dark:text-white'}
                        `}
                    >
                        <span className="text-xs mr-0.5">₺</span>
                        <span className="text-sm">{car.pricePerDay}</span>
                    </button>
                    {!isSelected && <div className="w-2 h-2 bg-white dark:bg-gray-800 absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>}
                </div>
            );
        })}

        {/* Floating Map Controls */}
        <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-30">
             <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-50 active:scale-95 transition-transform">
                 <i className="fas fa-crosshairs"></i>
             </button>
        </div>
        
        <div className="absolute bottom-1 left-1 pointer-events-none opacity-70 bg-white/50 px-1 rounded">
             <span className="text-[10px] text-gray-500 font-sans">Google</span>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] relative">
        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 md:px-6 flex gap-2 overflow-x-auto no-scrollbar shrink-0 z-20">
            <div className="min-w-[120px]">
                <Select 
                    className="text-sm py-1.5"
                    options={[
                        { value: '', label: 'Vites Tipi' }, 
                        { value: Transmission.AUTOMATIC, label: 'Otomatik' }, 
                        { value: Transmission.MANUAL, label: 'Manuel' }
                    ]} 
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                />
            </div>
            <div className="min-w-[120px]">
                <Select 
                    className="text-sm py-1.5"
                    options={[
                        { value: '', label: 'Yakıt' }, 
                        { value: FuelType.GASOLINE, label: 'Benzin' }, 
                        { value: FuelType.DIESEL, label: 'Dizel' },
                        { value: FuelType.ELECTRIC, label: 'Elektrik' }
                    ]} 
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                />
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => setShowFilterModal(true)}>
                <i className="fas fa-sliders-h mr-2"></i> Tüm Filtreler
            </Button>
        </div>

        {/* Mobile View Toggle - MOVED TO TOP RIGHT */}
        <div className="md:hidden absolute top-16 right-4 z-40 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 flex border border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-400'}`}
            >
                <i className="fas fa-list"></i>
            </button>
            <button 
                onClick={() => setViewMode('map')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${viewMode === 'map' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-400'}`}
            >
                <i className="fas fa-map-marked-alt"></i>
            </button>
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 flex overflow-hidden relative">
            {/* List View */}
            <div className={`w-full md:w-1/2 lg:w-2/5 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
                {loading ? (
                    <div className="flex justify-center py-10"><i className="fas fa-spinner fa-spin text-2xl text-brand-600"></i></div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-2">{cars.length} araç bulundu</p>
                        {cars.map(car => <CarListItem key={car.id} car={car} />)}
                        {cars.length === 0 && <p className="text-center text-gray-500 py-10">Arama kriterlerinize uygun araç bulunamadı.</p>}
                    </>
                )}
            </div>

            {/* Map View */}
            <div className={`absolute inset-0 z-10 md:static md:w-1/2 lg:w-3/5 md:block ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
                <MapView />
            </div>
        </div>

        {/* Full Screen Filter Modal */}
        {showFilterModal && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end">
                <div className="w-full md:w-96 bg-white dark:bg-gray-900 h-full p-6 shadow-2xl overflow-y-auto animate-fade-in-right">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold dark:text-white">Filtrele</h2>
                        <button onClick={() => setShowFilterModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Fiyat Aralığı (Günlük)</label>
                            <div className="flex items-center gap-4">
                                <Input type="number" placeholder="Min" onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))} />
                                <span className="text-gray-400">-</span>
                                <Input type="number" placeholder="Max" onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))} />
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sıralama</label>
                             <Select options={[
                                 { value: 'recommended', label: 'Önerilen' },
                                 { value: 'price_asc', label: 'Fiyat (Önce en düşük)' },
                                 { value: 'price_desc', label: 'Fiyat (Önce en yüksek)' },
                                 { value: 'rating', label: 'Puan (Yüksekten düşüğe)' },
                             ]} />
                        </div>

                         <div>
                             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Araç Tipi</label>
                             <div className="flex flex-wrap gap-2">
                                 {['Sedan', 'Hatchback', 'SUV', 'Van'].map(t => (
                                     <button key={t} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300">{t}</button>
                                 ))}
                             </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button fullWidth size="lg" onClick={() => setShowFilterModal(false)}>Sonuçları Göster</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
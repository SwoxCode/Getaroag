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
    <div className="w-full h-full relative overflow-hidden bg-gray-100">
        {/* 
            LIVE MAP EMBED 
            Using an iframe guarantees the map tiles load directly from OSM servers.
            pointer-events-none is used so the map acts as a background and doesn't steal clicks from Pins.
        */}
        <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://www.openstreetmap.org/export/embed.html?bbox=28.9388%2C40.9956%2C29.0854%2C41.0766&amp;layer=mapnik"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-90 grayscale-[0.1]"
            style={{ border: 0 }}
            title="Istanbul Map"
        ></iframe>
        
        {/* Pins Layer */}
        {cars.map((car, idx) => {
            const isSelected = selectedCarId === car.id;
            
            // Simulating realistic distribution on the map
            const topPos = 40 + (idx * 15) * (idx % 2 === 0 ? 1 : -0.8);
            const leftPos = 50 + (idx * 12) * (idx % 2 === 0 ? -1 : 0.9);

            return (
                <div
                    key={car.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? 'z-50' : 'z-10 hover:z-40'}`}
                    style={{
                        top: `${Math.max(20, Math.min(80, topPos))}%`, 
                        left: `${Math.max(10, Math.min(90, leftPos))}%`
                    }}
                >
                    {/* The Popup Bubble (Appears ABOVE the pin when selected) */}
                    {isSelected && (
                         <div className="absolute bottom-[calc(100%+16px)] left-1/2 transform -translate-x-1/2 w-64 md:w-72 animate-fade-in-up origin-bottom z-50">
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
                        </div>
                    )}

                    {/* The Pin - Matches Screenshot Exact Style */}
                    {/* Unselected: White BG, Purple Border, Black Text */}
                    {/* Selected: Purple BG, Purple Border, White Text */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedCarId(car.id); }}
                        className={`
                            relative flex items-center justify-center px-4 py-2 rounded-2xl font-bold shadow-lg transition-transform border-[2px]
                            ${isSelected 
                                ? 'bg-brand-600 text-white border-brand-600 scale-110 z-50' 
                                : 'bg-white text-gray-900 border-brand-600 hover:scale-105 z-10'}
                        `}
                    >
                        <span className="text-xs mr-0.5 font-normal">₺</span>
                        <span className="text-sm font-bold">{car.pricePerDay}</span>
                        
                        {/* Triangle Pointer */}
                        <div className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b 
                            ${isSelected 
                                ? 'bg-brand-600 border-brand-600' 
                                : 'bg-white border-brand-600'}
                        `}></div>
                    </button>
                </div>
            );
        })}
        
        {/* Map Attribution */}
        <div className="absolute bottom-1 right-1 pointer-events-none opacity-80 bg-white/70 px-1 rounded z-0">
             <span className="text-[10px] text-gray-600 font-sans">© OpenStreetMap</span>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px-57px)] md:h-[calc(100vh-80px)] relative">
        
        {/* Filters Bar & Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 md:px-6 flex items-center justify-between gap-2 z-20 sticky top-0">
            {/* Filter Scroll Area */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 pr-12">
                <div className="min-w-[110px]">
                    <Select 
                        className="text-xs py-1.5 h-9"
                        options={[
                            { value: '', label: 'Fiyat' }, 
                            { value: 'asc', label: 'Artan' }, 
                            { value: 'desc', label: 'Azalan' }
                        ]} 
                        onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                    />
                </div>
                <div className="min-w-[120px]">
                    <Select 
                        className="text-xs py-1.5 h-9"
                        options={[
                            { value: '', label: 'Araç Tipi' }, 
                            { value: 'sedan', label: 'Sedan' }, 
                            { value: 'suv', label: 'SUV' }
                        ]} 
                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    />
                </div>
                {/* Filter Modal Trigger */}
                <button 
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shrink-0"
                >
                    <i className="fas fa-sliders-h"></i>
                </button>
            </div>

            {/* List / Map Toggle (Top Right) */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 shrink-0 ml-2">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-7 rounded-md flex items-center justify-center text-xs transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 text-brand-600 shadow-sm font-bold' : 'text-gray-500'}`}
                >
                    <i className="fas fa-list"></i>
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`w-8 h-7 rounded-md flex items-center justify-center text-xs transition-all ${viewMode === 'map' ? 'bg-white dark:bg-gray-600 text-brand-600 shadow-sm font-bold' : 'text-gray-500'}`}
                >
                    <i className="fas fa-map"></i>
                </button>
            </div>
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

            {/* Map View - Always Rendered but controlled via CSS for Mobile */}
            <div className={`absolute inset-0 z-10 md:static md:w-1/2 lg:w-3/5 md:block ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
                <MapView />
            </div>
        </div>

        {/* Full Screen Filter Modal */}
        {showFilterModal && (
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-end">
                <div className="w-full md:w-96 bg-white dark:bg-gray-900 h-full p-6 shadow-2xl overflow-y-auto animate-fade-in-right">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold dark:text-white">Filtrele</h2>
                        <button onClick={() => setShowFilterModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="space-y-6">
                         <div>
                             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sıralama</label>
                             <Select options={[
                                 { value: 'recommended', label: 'Önerilen' },
                                 { value: 'price_asc', label: 'Fiyat (Önce en düşük)' },
                                 { value: 'price_desc', label: 'Fiyat (Önce en yüksek)' },
                             ]} />
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
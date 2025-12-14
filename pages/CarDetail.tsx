import React, { useState, useEffect } from 'react';
import { getCarById } from '../services/carService';
import { Car } from '../types';
import { Button, Card, Badge, Input } from '../components/UI';

interface CarDetailProps {
  carId: string;
  onBack: () => void;
}

export const CarDetail: React.FC<CarDetailProps> = ({ carId, onBack }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getCarById(carId);
      if (data) setCar(data);
      setLoading(false);
    };
    load();
  }, [carId]);

  if (loading || !car) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-2xl text-brand-600"></i></div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 md:pb-10">
      {/* Mobile Header Overlay */}
      <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-black/50 backdrop-blur p-2 rounded-full shadow-lg text-gray-800 dark:text-white md:hidden">
        <i className="fas fa-arrow-left"></i>
      </button>

      {/* Image Gallery */}
      <div className="relative h-64 md:h-96 w-full bg-gray-200">
        <img src={car.images[activeImg]} alt={car.model} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {activeImg + 1} / {car.images.length}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{car.brand} {car.model}</h1>
                            <p className="text-gray-500">{car.year} • {car.type}</p>
                        </div>
                        <div className="flex flex-col items-end">
                             <div className="flex items-center text-yellow-500 font-bold">
                                <i className="fas fa-star mr-1"></i> {car.owner.rating}
                             </div>
                             <span className="text-xs text-gray-400">({car.owner.responseRate} yorum)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <i className="fas fa-gas-pump text-gray-400 mb-1"></i>
                            <span className="text-sm font-medium dark:text-white">{car.fuelType}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <i className="fas fa-cogs text-gray-400 mb-1"></i>
                            <span className="text-sm font-medium dark:text-white">{car.transmission}</span>
                        </div>
                         <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <i className="fas fa-chair text-gray-400 mb-1"></i>
                            <span className="text-sm font-medium dark:text-white">5 Koltuk</span>
                        </div>
                         <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <i className="fas fa-door-closed text-gray-400 mb-1"></i>
                            <span className="text-sm font-medium dark:text-white">4 Kapı</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Açıklama</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{car.description}</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Özellikler</h3>
                        <div className="flex flex-wrap gap-2">
                            {car.features.map((f, i) => (
                                <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-300 rounded-full text-sm">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Owner Info */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Araç Sahibi</h3>
                    <div className="flex items-center gap-4">
                        <img src={car.owner.photoUrl} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold dark:text-white">{car.owner.name}</h4>
                                {car.owner.verified && <i className="fas fa-check-circle text-blue-500" title="Doğrulanmış"></i>}
                            </div>
                            <p className="text-sm text-gray-500">Katılım: 2021</p>
                        </div>
                        <div className="ml-auto">
                            <Button variant="outline" size="sm">Profili Gör</Button>
                        </div>
                    </div>
                </Card>

                {/* Location Mock */}
                <Card className="p-0 overflow-hidden h-64 relative">
                     <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/Istanbul_map.png")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 bg-brand-500/30 rounded-full flex items-center justify-center animate-pulse">
                                <div className="w-4 h-4 bg-brand-600 rounded-full border-2 border-white"></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-3 text-sm font-medium">
                        <i className="fas fa-map-marker-alt text-brand-600 mr-2"></i>
                        {car.location.address || `${car.location.district}, ${car.location.city}`}
                    </div>
                </Card>
            </div>

            {/* Booking Sidebar / Bottom Sheet on Mobile */}
            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <Card className="p-6 border-brand-200 dark:border-brand-900 border-2">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">₺{car.pricePerDay}</span>
                                <span className="text-gray-500"> / gün</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Teslim Alma</label>
                                <Input type="datetime-local" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Teslim Etme</label>
                                <Input type="datetime-local" />
                            </div>
                        </div>

                        <Button fullWidth size="lg">Rezervasyon Yap</Button>
                        <p className="text-xs text-center text-gray-500 mt-4">Henüz ödeme alınmayacak</p>
                    </Card>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef } from 'react';
import { Button, Input, Select, Card } from '../components/UI';
import { BRANDS, CITIES, CAR_MODELS } from '../constants';
import { FuelType, Transmission, CarType, Car } from '../types';
import { saveNewCar } from '../services/carService';

interface ListCarProps {
  onNavigate?: (page: string) => void;
}

export const ListCar: React.FC<ListCarProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const totalSteps = 4;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    type: '',
    fuel: '',
    transmission: '',
    city: '',
    district: '',
    address: '',
    lat: 0,
    lng: 0,
    price: '',
    description: '',
    photos: [] as string[]
  });

  const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - i).toString());

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
        if (field === 'brand') return { ...prev, [field]: value, model: '' };
        return { ...prev, [field]: value };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file as Blob));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
        alert("Tarayıcınız konum servisini desteklemiyor.");
        return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // In a real app, we would call a Reverse Geocoding API here.
            // For MVP, we set coordinates and a placeholder text.
            setFormData(prev => ({
                ...prev,
                lat: latitude,
                lng: longitude,
                address: `GPS Konumu: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                city: 'İstanbul', // Fallback for MVP flow
                district: 'Mevcut Konum'
            }));
            setGpsLoading(false);
            alert("Konum başarıyla alındı!");
        },
        (error) => {
            setGpsLoading(false);
            let msg = "Konum alınamadı.";
            if (error.code === 1) msg = "Konum izni reddedildi.";
            alert(msg);
        }
    );
  };

  const handlePublish = () => {
    if(!formData.brand || !formData.model || !formData.year || !formData.price) {
        alert("Lütfen temel bilgileri doldurun.");
        return;
    }
    
    setLoading(true);

    // Create a real Car object
    const newCar: Car = {
        id: 'local_' + Date.now(),
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        pricePerDay: parseInt(formData.price),
        fuelType: formData.fuel as FuelType,
        transmission: formData.transmission as Transmission,
        type: formData.type as CarType,
        images: formData.photos.length > 0 ? formData.photos : ['https://picsum.photos/800/600?car=new'],
        location: {
            lat: formData.lat || 41.0082,
            lng: formData.lng || 28.9784,
            city: formData.city || 'Belirsiz',
            district: formData.district || 'Merkez',
            address: formData.address
        },
        owner: {
            id: 'u1', // Matches the mock user in Profile
            name: 'Can Yılmaz',
            photoUrl: 'https://picsum.photos/200/200',
            rating: 5.0,
            responseRate: 100,
            verified: true
        },
        description: formData.description,
        features: ['Yeni İlan'],
        isAvailable: true
    };

    // Save to service (LocalStorage)
    saveNewCar(newCar);

    setTimeout(() => {
        setLoading(false);
        alert('Aracınız başarıyla yayınlandı ve listeye eklendi!');
        if (onNavigate) {
            onNavigate('profile');
        }
    }, 1000);
  };

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
        <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aracını Listele</h1>
        <p className="text-gray-500 mt-2">Araban yatmasın, kazanca dönüşsün.</p>
      </div>

      <ProgressBar />

      <Card className="p-6 md:p-8">
        {step === 1 && (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Araç Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                        label="Marka" 
                        value={formData.brand}
                        options={[{value: '', label: 'Seçiniz'}, ...BRANDS.map(b => ({ value: b, label: b }))]}
                        onChange={(e) => handleChange('brand', e.target.value)} 
                    />
                    
                    <Select 
                        label="Model" 
                        value={formData.model}
                        disabled={!formData.brand}
                        options={[
                            {value: '', label: formData.brand ? 'Seçiniz' : 'Önce Marka Seçin'}, 
                            ...(formData.brand && CAR_MODELS[formData.brand] ? CAR_MODELS[formData.brand].map(m => ({ value: m, label: m })) : [])
                        ]} 
                        onChange={(e) => handleChange('model', e.target.value)}
                    />

                    <Select 
                        label="Yıl" 
                        value={formData.year}
                        options={[{value: '', label: 'Seçiniz'}, ...years.map(y => ({ value: y, label: y }))]} 
                        onChange={(e) => handleChange('year', e.target.value)}
                    />

                    <Select 
                        label="Kasa Tipi" 
                        value={formData.type}
                        options={[{value: '', label: 'Seçiniz'}, ...Object.values(CarType).map(t => ({ value: t, label: t }))]} 
                        onChange={(e) => handleChange('type', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                        label="Yakıt" 
                        value={formData.fuel}
                        options={[{value: '', label: 'Seçiniz'}, ...Object.values(FuelType).map(t => ({ value: t, label: t }))]} 
                        onChange={(e) => handleChange('fuel', e.target.value)}
                    />
                    <Select 
                        label="Vites" 
                        value={formData.transmission}
                        options={[{value: '', label: 'Seçiniz'}, ...Object.values(Transmission).map(t => ({ value: t, label: t }))]} 
                        onChange={(e) => handleChange('transmission', e.target.value)}
                    />
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Konum</h2>
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800 text-sm mb-4">
                    <i className="fas fa-info-circle mt-1"></i>
                    <p>Aracınızın tam konumu sadece rezervasyon kesinleştiğinde kiracı ile paylaşılır.</p>
                </div>
                <Select 
                    label="Şehir" 
                    value={formData.city}
                    options={[{value: '', label: 'Seçiniz'}, ...CITIES.map(c => ({ value: c.id, label: c.name }))]} 
                    onChange={(e) => handleChange('city', e.target.value)}
                />
                <Input 
                    label="İlçe" 
                    placeholder="Örn: Kadıköy" 
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                />
                <div className="relative">
                    <Input 
                        label="Tam Adres" 
                        placeholder="Cadde, sokak, no..." 
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                    <button 
                        onClick={handleGPS}
                        disabled={gpsLoading}
                        className="absolute right-2 top-8 text-brand-600 text-sm font-bold hover:underline disabled:opacity-50"
                    >
                        {gpsLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-location-arrow mr-1"></i> GPS</>}
                    </button>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-6">
                 <h2 className="text-xl font-semibold mb-4 dark:text-white">Fotoğraflar</h2>
                 <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload}
                 />
                 
                 {formData.photos.length === 0 ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Fotoğrafları buraya sürükleyin veya seçin</p>
                        <p className="text-xs text-gray-400 mt-1">Min. 3 fotoğraf</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                         <div className="grid grid-cols-3 gap-2">
                            {formData.photos.map((photo, i) => (
                                <div key={i} className="aspect-video relative group">
                                    <img src={photo} className="w-full h-full object-cover rounded-lg" alt={`Upload ${i}`} />
                                    <button 
                                        onClick={() => setFormData(prev => ({...prev, photos: prev.photos.filter((_, idx) => idx !== i)}))}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                </div>
                            ))}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <i className="fas fa-plus text-gray-400 text-xl"></i>
                            </div>
                         </div>
                         <p className="text-xs text-gray-500 text-center">{formData.photos.length} fotoğraf seçildi</p>
                    </div>
                 )}
            </div>
        )}

        {step === 4 && (
             <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Fiyatlandırma</h2>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input 
                            label="Günlük Fiyat (₺)" 
                            type="number" 
                            placeholder="850" 
                            className="text-lg font-bold"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                    <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600" 
                        rows={4} 
                        placeholder="Aracınızın özelliklerinden bahsedin..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    ></textarea>
                </div>
            </div>
        )}

        <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={step === 1}>Geri</Button>
            <Button onClick={step === totalSteps ? handlePublish : nextStep} disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {step === totalSteps ? 'Yayınla' : 'Devam Et'}
            </Button>
        </div>
      </Card>
    </div>
  );
};
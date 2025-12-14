import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Badge } from '../components/UI';
import { MOCK_CARS } from '../constants';

// Mock User Data
const MOCK_USER = {
  id: 'u1',
  name: 'Can Yılmaz',
  email: 'can@example.com',
  phone: '555 123 45 67',
  photoUrl: 'https://picsum.photos/200/200',
  bannerUrl: 'https://picsum.photos/1200/300',
  iban: 'TR12 3456 7890 1234 5678 90'
};

const INITIAL_REQUESTS = [
  { id: 'r1', car: 'Fiat Egea', date: '12-15 Ekim', price: 2550, status: 'pending', renter: 'Ayşe K.' },
  { id: 'r2', car: 'Fiat Egea', date: '20-22 Ekim', price: 1700, status: 'approved', renter: 'Mehmet B.' },
];

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<any>(null); // null = not logged in
  const [loadingAuth, setLoadingAuth] = useState(true); // New state to prevent flash
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'cars' | 'requests' | 'settings'>('cars');
  
  // Data States
  const [myCars, setMyCars] = useState(MOCK_CARS.slice(0, 2));
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  // Registration States
  const [regStep, setRegStep] = useState(1); // 1: Info, 2: Verification
  const [verificationCode, setVerificationCode] = useState('');

  // Check for persisted session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('getaroag_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingAuth(false);
  }, []);

  // Sync My Cars with LocalStorage (to show newly added cars in profile)
  useEffect(() => {
     if (user) {
        const storedCustomCars = localStorage.getItem('getaroag_custom_cars');
        if (storedCustomCars) {
            const customCars = JSON.parse(storedCustomCars);
            // Combine mock cars (slice 0,2) with custom cars
            // Note: In a real app this would come from one API endpoint
            setMyCars([...customCars, ...MOCK_CARS.slice(0, 2)]);
        }
     }
  }, [user]);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        const userData = MOCK_USER;
        setUser(userData);
        localStorage.setItem('getaroag_user', JSON.stringify(userData));
    }, 500);
  };

  // Register Handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep === 1) {
        setRegStep(2);
    } else {
        // Verify Code
        if (verificationCode === '123456') {
            const userData = MOCK_USER;
            setUser(userData);
            localStorage.setItem('getaroag_user', JSON.stringify(userData));
        } else {
            alert('Lütfen demo kodunu giriniz: 123456');
        }
    }
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('getaroag_user');
      setAuthMode('login');
  };

  // Car Actions
  const handleDeleteCar = (id: string) => {
      if (window.confirm('Bu aracı silmek istediğinize emin misiniz?')) {
          setMyCars(prev => prev.filter(c => c.id !== id));
      }
  };

  const handleEditCar = (id: string) => {
      alert('Düzenleme modu bu demoda aktif değildir.');
  };

  // Request Actions
  const handleRequestAction = (id: string, status: 'approved' | 'rejected' | 'pending') => {
      setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: status as string } : req
      ));
  };

  if (loadingAuth) {
      return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl text-brand-600"></i></div>;
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
                {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </h2>
            
            {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input label="E-posta" type="email" placeholder="ornek@email.com" required />
                    <Input label="Şifre" type="password" placeholder="******" required />
                    <Button fullWidth type="submit">Giriş Yap</Button>
                    
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
                        <p className="text-sm text-gray-500 mb-3">Hesabın yok mu?</p>
                        <Button 
                            type="button" 
                            variant="outline" 
                            fullWidth 
                            onClick={() => setAuthMode('register')}
                        >
                            Kayıt Ol
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                    {regStep === 1 ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Ad" placeholder="Can" required />
                                <Input label="Soyad" placeholder="Yılmaz" required />
                            </div>
                            <Input label="E-posta" type="email" placeholder="ornek@email.com" required />
                            <Input label="Telefon" type="tel" placeholder="5XX XXX XX XX" required />
                            <Input label="Şifre" type="password" placeholder="******" required />
                            <Button fullWidth type="submit">Devam Et</Button>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                                  <i className="fas fa-envelope-open-text text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold dark:text-white">E-posta Doğrulama</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">E-posta adresine gönderilen kodu gir.</p>
                                
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-2 rounded text-sm font-mono border border-yellow-200 dark:border-yellow-900">
                                    Demo Kodu: <strong>123456</strong>
                                </div>
                            </div>
                            
                            <Input 
                                className="text-center text-2xl tracking-widest font-mono" 
                                placeholder="------" 
                                maxLength={6} 
                                required 
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            
                            <Button fullWidth type="submit">Doğrula ve Kayıt Ol</Button>
                            
                            <button type="button" onClick={() => setRegStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2">
                                E-posta adresini değiştir
                            </button>
                        </>
                    )}
                    
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            Zaten üye misin? <button type="button" onClick={() => { setAuthMode('login'); setRegStep(1); }} className="text-brand-600 font-bold hover:underline">Giriş Yap</button>
                        </p>
                    </div>
                </form>
            )}
        </Card>
      </div>
    );
  }

  // Logged In View
  return (
    <div className="pb-20">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-gray-300 relative">
            <img src={user.bannerUrl} className="w-full h-full object-cover" alt="Profile Banner" />
            <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-10">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
                <img src={user.photoUrl} className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 object-cover" alt="Profile" />
                <div className="flex-1 pb-2 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{user.email}</p>
                </div>
                <div className="pb-2 flex gap-3 w-full md:w-auto justify-center md:justify-end">
                    <Button variant="outline" onClick={handleLogout} className="bg-white/80 backdrop-blur">Çıkış Yap</Button>
                    <Button className="shadow-lg" onClick={() => onNavigate('list-car')}>Aracını Listele</Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('cars')}
                    className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'cars' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    Araçlarım ({myCars.length})
                </button>
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'requests' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    Rezervasyon Talepleri
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'settings' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    Hesap & IBAN
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === 'cars' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCars.map(car => (
                            <Card key={car.id} className="group hover:shadow-md transition-shadow">
                                <div className="relative h-48">
                                    <img src={car.images[0]} className="w-full h-full object-cover" alt={car.model} />
                                    <div className="absolute top-2 right-2">
                                        <Badge color="green">Yayında</Badge>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                                        <i className="fas fa-eye mr-1"></i> 142 Görüntülenme
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg dark:text-white">{car.brand} {car.model}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{car.pricePerDay} ₺ / gün</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" fullWidth onClick={() => handleEditCar(car.id)}>Düzenle</Button>
                                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900" onClick={() => handleDeleteCar(car.id)}><i className="fas fa-trash"></i></Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {/* Add New Car Card */}
                        <button 
                            onClick={() => onNavigate('list-car')}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-full min-h-[300px] w-full"
                        >
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                                <i className="fas fa-plus text-2xl"></i>
                            </div>
                            <span className="font-medium text-gray-600 dark:text-gray-300">Yeni Araç Ekle</span>
                        </button>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {requests.length === 0 && <p className="text-gray-500 text-center py-8">Henüz bir talep yok.</p>}
                        {requests.map(req => (
                            <Card key={req.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-brand-600 font-bold text-xl shrink-0">
                                        {req.renter.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white">{req.renter} <span className="text-gray-400 font-normal">şunun için talep gönderdi:</span> {req.car}</h4>
                                        <p className="text-sm text-gray-500"><i className="far fa-calendar-alt mr-1"></i> {req.date} • Toplam: <span className="font-bold text-gray-900 dark:text-gray-300">₺{req.price}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {req.status === 'pending' ? (
                                        <>
                                            <Button size="sm" variant="outline" onClick={() => handleRequestAction(req.id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 w-1/2 md:w-auto">Reddet</Button>
                                            <Button size="sm" onClick={() => handleRequestAction(req.id, 'approved')} className="bg-green-600 hover:bg-green-700 w-1/2 md:w-auto">Onayla</Button>
                                        </>
                                    ) : (
                                        <Badge color={req.status === 'approved' ? 'green' : 'gray'}>
                                            {req.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                        </Badge>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <Card className="max-w-2xl p-6 md:p-8">
                        <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
                            <i className="fas fa-money-check-alt text-brand-600"></i> Ödeme Bilgileri
                        </h3>
                        <form className="space-y-6">
                            <Input label="Ad Soyad (Hesap Sahibi)" defaultValue={user.name} />
                            <Input label="IBAN" defaultValue={user.iban} placeholder="TR..." />
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                                    <i className="fas fa-user-edit text-brand-600"></i> İletişim Bilgileri
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="E-posta" defaultValue={user.email} />
                                    <Input label="Telefon" defaultValue={user.phone} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="button" onClick={() => alert('Bilgiler güncellendi!')}>Kaydet</Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
};
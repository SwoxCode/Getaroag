import { Car, CarType, FuelType, Transmission } from './types';

export const APP_NAME = "Getaroag";
export const SLOGAN_MAIN = "Dakikalar içinde aracını kirala";
export const SLOGAN_PASSIVE = "Araban yatmasın, kazanca dönüşsün";

export const CITIES = [
  { id: 'istanbul', name: 'İstanbul', image: 'https://picsum.photos/800/600?random=1' },
  { id: 'izmir', name: 'İzmir', image: 'https://picsum.photos/800/600?random=2' },
  { id: 'ankara', name: 'Ankara', image: 'https://picsum.photos/800/600?random=3' },
  { id: 'antalya', name: 'Antalya', image: 'https://picsum.photos/800/600?random=4' },
];

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    brand: 'Fiat',
    model: 'Egea',
    year: 2022,
    pricePerDay: 850,
    fuelType: FuelType.DIESEL,
    transmission: Transmission.AUTOMATIC,
    type: CarType.SEDAN,
    images: ['https://picsum.photos/800/500?random=10', 'https://picsum.photos/800/500?random=11'],
    location: { lat: 41.0082, lng: 28.9784, city: 'İstanbul', district: 'Kadıköy' },
    owner: { id: 'o1', name: 'Ahmet Y.', photoUrl: 'https://picsum.photos/100/100?random=1', rating: 4.8, responseRate: 95, verified: true },
    description: 'Şehir içi kullanım için ideal, az yakan aile aracı.',
    features: ['Bluetooth', 'Klima', 'USB', 'Arka Park Sensörü'],
    isAvailable: true
  },
  {
    id: '2',
    brand: 'Renault',
    model: 'Clio',
    year: 2021,
    pricePerDay: 750,
    fuelType: FuelType.GASOLINE,
    transmission: Transmission.MANUAL,
    type: CarType.HATCHBACK,
    images: ['https://picsum.photos/800/500?random=12'],
    location: { lat: 41.0122, lng: 28.9854, city: 'İstanbul', district: 'Beşiktaş' },
    owner: { id: 'o2', name: 'Selin K.', photoUrl: 'https://picsum.photos/100/100?random=2', rating: 4.9, responseRate: 98, verified: true },
    description: 'Çok temiz, sigara içilmemiş, ekonomik araç.',
    features: ['CarPlay', 'Start/Stop', 'Klima'],
    isAvailable: true
  },
  {
    id: '3',
    brand: 'Peugeot',
    model: '3008',
    year: 2023,
    pricePerDay: 1500,
    fuelType: FuelType.DIESEL,
    transmission: Transmission.AUTOMATIC,
    type: CarType.SUV,
    images: ['https://picsum.photos/800/500?random=13'],
    location: { lat: 41.0150, lng: 28.9900, city: 'İstanbul', district: 'Şişli' },
    owner: { id: 'o3', name: 'Mehmet T.', photoUrl: 'https://picsum.photos/100/100?random=3', rating: 5.0, responseRate: 90, verified: true },
    description: 'Konforlu uzun yol aracı. Geniş bagaj hacmi.',
    features: ['Panoramik Cam Tavan', 'Navigasyon', 'Deri Koltuk', '360 Kamera'],
    isAvailable: true
  },
  {
    id: '4',
    brand: 'Tesla',
    model: 'Model Y',
    year: 2023,
    pricePerDay: 3500,
    fuelType: FuelType.ELECTRIC,
    transmission: Transmission.AUTOMATIC,
    type: CarType.SUV,
    images: ['https://picsum.photos/800/500?random=14'],
    location: { lat: 38.4237, lng: 27.1428, city: 'İzmir', district: 'Alsancak' },
    owner: { id: 'o4', name: 'Caner E.', photoUrl: 'https://picsum.photos/100/100?random=4', rating: 4.7, responseRate: 88, verified: true },
    description: 'Elektrikli sürüş keyfi. Uzun menzil.',
    features: ['Otopilot', 'Premium Ses Sistemi', 'Hızlı Şarj'],
    isAvailable: true
  }
];

export const BRANDS = [
  'Fiat', 'Renault', 'Volkswagen', 'Ford', 'Toyota', 'Peugeot', 
  'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Honda', 'Hyundai', 
  'Kia', 'Volvo', 'Nissan', 'Citroën', 'Opel', 'Skoda', 'Seat', 'Dacia'
];

export const CAR_MODELS: Record<string, string[]> = {
  'Fiat': ['Egea', '500', 'Panda', 'Doblo', 'Fiorino'],
  'Renault': ['Clio', 'Megane', 'Taliant', 'Captur', 'Austral', 'Zoe'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'Taigo'],
  'Ford': ['Fiesta', 'Focus', 'Puma', 'Kuga', 'Ranger'],
  'Toyota': ['Corolla', 'Yaris', 'C-HR', 'RAV4', 'Camry'],
  'Peugeot': ['208', '2008', '308', '3008', '408', '5008'],
  'BMW': ['1 Serisi', '2 Serisi', '3 Serisi', '5 Serisi', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['A-Serisi', 'C-Serisi', 'E-Serisi', 'CLA', 'GLA', 'GLC'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
  'Honda': ['Civic', 'Jazz', 'HR-V', 'CR-V'],
  'Hyundai': ['i10', 'i20', 'i30', 'Bayon', 'Tucson', 'Elantra'],
  'Kia': ['Picanto', 'Rio', 'Stonic', 'Ceed', 'Sportage'],
  'Volvo': ['XC40', 'XC60', 'XC90', 'S60', 'S90'],
  'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail'],
  'Citroën': ['C3', 'C4', 'C5 Aircross', 'C-Elysee'],
  'Opel': ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland'],
  'Skoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq'],
  'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca'],
  'Dacia': ['Sandero', 'Duster', 'Jogger', 'Spring']
};

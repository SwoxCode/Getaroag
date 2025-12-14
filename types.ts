export enum FuelType {
  GASOLINE = 'Benzin',
  DIESEL = 'Dizel',
  HYBRID = 'Hibrit',
  ELECTRIC = 'Elektrik'
}

export enum Transmission {
  MANUAL = 'Manuel',
  AUTOMATIC = 'Otomatik'
}

export enum CarType {
  SEDAN = 'Sedan',
  HATCHBACK = 'Hatchback',
  SUV = 'SUV',
  VAN = 'Van'
}

export interface Location {
  lat: number;
  lng: number;
  city: string;
  district: string;
  address?: string;
}

export interface Owner {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  responseRate: number;
  verified: boolean;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuelType: FuelType;
  transmission: Transmission;
  type: CarType;
  images: string[];
  location: Location;
  owner: Owner;
  description: string;
  features: string[];
  isAvailable: boolean;
}

export interface BookingRequest {
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected';
}

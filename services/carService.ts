import { Car, FuelType, Transmission } from '../types';
import { MOCK_CARS } from '../constants';

export interface FilterParams {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: FuelType;
  transmission?: Transmission;
  startDate?: Date;
  endDate?: Date;
}

export const getCars = async (filters: FilterParams = {}): Promise<Car[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // 1. Get Static Mock Cars
  let allCars = [...MOCK_CARS];

  // 2. Get User Created Cars from LocalStorage (Simulating Backend)
  try {
    const storedCars = localStorage.getItem('getaroag_custom_cars');
    if (storedCars) {
      const parsedCars = JSON.parse(storedCars);
      // Add custom cars to the beginning of the list
      allCars = [...parsedCars, ...allCars];
    }
  } catch (e) {
    console.error("Error reading custom cars", e);
  }

  // 3. Apply Filters
  let filtered = allCars;

  if (filters.city) {
    filtered = filtered.filter(c => c.location.city.toLowerCase().includes(filters.city?.toLowerCase() || ''));
  }

  if (filters.minPrice) {
    filtered = filtered.filter(c => c.pricePerDay >= (filters.minPrice || 0));
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(c => c.pricePerDay <= (filters.maxPrice || 100000));
  }

  if (filters.fuelType) {
    filtered = filtered.filter(c => c.fuelType === filters.fuelType);
  }

  if (filters.transmission) {
    filtered = filtered.filter(c => c.transmission === filters.transmission);
  }

  return filtered;
};

export const getCarById = async (id: string): Promise<Car | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check static cars
  let car = MOCK_CARS.find(c => c.id === id);
  
  // If not found, check local storage cars
  if (!car) {
      try {
        const storedCars = localStorage.getItem('getaroag_custom_cars');
        if (storedCars) {
          const parsedCars = JSON.parse(storedCars);
          car = parsedCars.find((c: Car) => c.id === id);
        }
      } catch (e) { console.error(e); }
  }
  
  return car;
};

// Helper to save a new car (called from ListCar)
export const saveNewCar = (newCar: Car) => {
    try {
        const storedCars = localStorage.getItem('getaroag_custom_cars');
        const currentCars = storedCars ? JSON.parse(storedCars) : [];
        currentCars.unshift(newCar); // Add to top
        localStorage.setItem('getaroag_custom_cars', JSON.stringify(currentCars));
        return true;
    } catch (e) {
        console.error("Save failed", e);
        return false;
    }
};
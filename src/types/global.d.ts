declare interface ParkingSpot {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  pricePerHour?: number;
  features?: string[];
  address?: string;
  distanceMeters?: number;
  availability?: 'available' | 'occupied' | 'unknown';
}

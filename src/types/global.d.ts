declare interface ParkingSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  pricePerHour?: number;
  features?: string[];
  address?: string;
  distanceMeters?: number;
  availability?: 'available' | 'occupied' | 'unknown';
}

export interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  available: number;
  total: number;
  price: string;
  type: string;
  rating: number;
  lastUpdated: string;
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  images?: string[];
  isRealSpot?: boolean;
}

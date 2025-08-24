export interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  available: number;
  total: number;
  price: string;
  type: 'street' | 'mall' | 'office' | 'attraction' | 'transport' | 'university' | 'hospital' | 'public' | 'sports' | 'cultural' | 'premium';
  rating: number;
  lastUpdated: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  images: string[];
  isRealSpot?: boolean; // New property to distinguish real vs demo data
}

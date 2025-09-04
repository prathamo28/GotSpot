export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  availability: {
    current: number;
    total: number;
    lastUpdated: string;
  };
  pricing: {
    hourly: string;
    daily?: string;
    currency: string;
  };
  features: string[];
  rating: number;
  type: 'street' | 'mall' | 'office' | 'attraction' | 'transport' | 'university' | 'hospital' | 'public' | 'sports' | 'cultural' | 'premium';
  isRealSpot: boolean;
  source: 'google_maps' | 'user_contributed' | 'demo';
  distance?: number; // Distance from user in meters
  images?: string[];
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    city: string;
    notifications: boolean;
    searchRadius: number;
    favoriteTypes: string[];
  };
  createdAt: string;
  lastActive: string;
}

export interface SearchFilters {
  radius: number;
  priceRange: {
    min: number;
    max: number;
  };
  types: string[];
  features: string[];
  availability: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

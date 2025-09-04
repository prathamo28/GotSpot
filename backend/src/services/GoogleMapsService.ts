import axios from 'axios';
import { logger } from '../utils/logger';

export interface GoogleMapsConfig {
  apiKey: string;
  baseUrl: string;
}

export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

export interface NearbySearchRequest {
  location: {
    lat: number;
    lng: number;
  };
  radius: number;
  type?: string;
  keyword?: string;
}

export class GoogleMapsService {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
    
    if (!this.apiKey) {
      logger.warn('Google Maps API key not configured');
    }
  }

  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public async nearbySearch(request: NearbySearchRequest): Promise<PlaceResult[]> {
    if (!this.isConfigured()) {
      throw new Error('Google Maps API not configured');
    }

    const cacheKey = this.getCacheKey('nearby', request);
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      logger.info('Returning cached nearby search results');
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params: {
          key: this.apiKey,
          location: `${request.location.lat},${request.location.lng}`,
          radius: request.radius,
          type: request.type || 'parking',
          keyword: request.keyword || 'parking',
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      const results = response.data.results.map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        geometry: {
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        },
        types: place.types,
        rating: place.rating,
        price_level: place.price_level,
        opening_hours: place.opening_hours,
      }));

      this.setCachedData(cacheKey, results);
      logger.info(`Found ${results.length} nearby parking spots`);
      return results;
    } catch (error) {
      logger.error('Error in nearby search:', error);
      throw error;
    }
  }

  public async textSearch(query: string, location?: { lat: number; lng: number }): Promise<PlaceResult[]> {
    if (!this.isConfigured()) {
      throw new Error('Google Maps API not configured');
    }

    const cacheKey = this.getCacheKey('text', { query, location });
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      logger.info('Returning cached text search results');
      return cached;
    }

    try {
      const params: any = {
        key: this.apiKey,
        query: `${query} parking`,
      };

      if (location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = 10000; // 10km radius
      }

      const response = await axios.get(`${this.baseUrl}/place/textsearch/json`, {
        params,
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      const results = response.data.results.map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        geometry: {
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        },
        types: place.types,
        rating: place.rating,
        price_level: place.price_level,
        opening_hours: place.opening_hours,
      }));

      this.setCachedData(cacheKey, results);
      logger.info(`Found ${results.length} parking spots for query: ${query}`);
      return results;
    } catch (error) {
      logger.error('Error in text search:', error);
      throw error;
    }
  }

  public async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!this.isConfigured()) {
      throw new Error('Google Maps API not configured');
    }

    const cacheKey = this.getCacheKey('geocode', { address });
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          key: this.apiKey,
          address,
        },
      });

      if (response.data.status !== 'OK' || !response.data.results.length) {
        return null;
      }

      const location = response.data.results[0].geometry.location;
      const result = {
        lat: location.lat,
        lng: location.lng,
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('Error in geocoding:', error);
      return null;
    }
  }

  public async getDirections(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    if (!this.isConfigured()) {
      throw new Error('Google Maps API not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/directions/json`, {
        params: {
          key: this.apiKey,
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode: 'driving',
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Directions API error: ${response.data.status}`);
      }

      return response.data;
    } catch (error) {
      logger.error('Error getting directions:', error);
      throw error;
    }
  }

  public calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Return distance in meters
  }
}

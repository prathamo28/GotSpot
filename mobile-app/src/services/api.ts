import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParkingSpot, User, SearchFilters, Location } from '../types/ParkingSpot';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          await AsyncStorage.removeItem('auth_token');
          // You can dispatch a logout action here
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    return { token, user };
  }

  async register(email: string, password: string, name: string) {
    const response = await this.api.post('/auth/register', { email, password, name });
    const { token, user } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    return { token, user };
  }

  async logout() {
    await AsyncStorage.removeItem('auth_token');
  }

  // Parking spots
  async getParkingSpots(location: Location, filters?: SearchFilters): Promise<ParkingSpot[]> {
    const response = await this.api.get('/parking/spots', {
      params: {
        lat: location.latitude,
        lng: location.longitude,
        ...filters,
      },
    });
    return response.data;
  }

  async getParkingSpot(id: string): Promise<ParkingSpot> {
    const response = await this.api.get(`/parking/spots/${id}`);
    return response.data;
  }

  async searchParkingSpots(query: string, location: Location): Promise<ParkingSpot[]> {
    const response = await this.api.get('/parking/search', {
      params: {
        query,
        lat: location.latitude,
        lng: location.longitude,
      },
    });
    return response.data;
  }

  async updateParkingSpot(id: string, updates: Partial<ParkingSpot>): Promise<ParkingSpot> {
    const response = await this.api.put(`/parking/spots/${id}`, updates);
    return response.data;
  }

  // User profile
  async getUserProfile(): Promise<User> {
    const response = await this.api.get('/user/profile');
    return response.data;
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    const response = await this.api.put('/user/profile', updates);
    return response.data;
  }

  // Favorites
  async getFavorites(): Promise<ParkingSpot[]> {
    const response = await this.api.get('/user/favorites');
    return response.data;
  }

  async addToFavorites(spotId: string): Promise<void> {
    await this.api.post('/user/favorites', { spotId });
  }

  async removeFromFavorites(spotId: string): Promise<void> {
    await this.api.delete(`/user/favorites/${spotId}`);
  }

  // Reviews
  async addReview(spotId: string, rating: number, comment: string): Promise<void> {
    await this.api.post(`/parking/spots/${spotId}/reviews`, { rating, comment });
  }

  // Notifications
  async enableNotifications(spotId: string): Promise<void> {
    await this.api.post('/notifications/enable', { spotId });
  }

  async disableNotifications(spotId: string): Promise<void> {
    await this.api.post('/notifications/disable', { spotId });
  }

  // Analytics
  async trackEvent(event: string, data?: any): Promise<void> {
    await this.api.post('/analytics/track', { event, data });
  }
}

export default new ApiService();

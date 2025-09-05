import { Firestore } from 'firebase-admin/firestore';
import { GoogleMapsService } from './GoogleMapsService';
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
    distance?: number;
    images?: string[];
}
export declare class ParkingDataService {
    private db;
    private googleMapsService;
    constructor(db: Firestore, googleMapsService: GoogleMapsService);
    getParkingSpots(location: {
        lat: number;
        lng: number;
    }, radius?: number, filters?: any): Promise<ParkingSpot[]>;
    private getRealParkingSpots;
    private getDemoParkingSpots;
    private convertPlaceToParkingSpot;
    private applyFilters;
    private extractPrice;
    searchParkingSpots(query: string, location: {
        lat: number;
        lng: number;
    }): Promise<ParkingSpot[]>;
    getParkingSpot(id: string): Promise<ParkingSpot | null>;
}
//# sourceMappingURL=ParkingDataService.d.ts.map
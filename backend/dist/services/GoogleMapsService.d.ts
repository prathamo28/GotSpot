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
export declare class GoogleMapsService {
    private apiKey;
    private baseUrl;
    private cache;
    private readonly CACHE_DURATION;
    constructor();
    isConfigured(): boolean;
    private getCacheKey;
    private getCachedData;
    private setCachedData;
    nearbySearch(request: NearbySearchRequest): Promise<PlaceResult[]>;
    textSearch(query: string, location?: {
        lat: number;
        lng: number;
    }): Promise<PlaceResult[]>;
    geocode(address: string): Promise<{
        lat: number;
        lng: number;
    } | null>;
    getDirections(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): Promise<any>;
    calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
}
//# sourceMappingURL=GoogleMapsService.d.ts.map
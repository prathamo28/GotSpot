"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingDataService = void 0;
const logger_1 = require("../utils/logger");
class ParkingDataService {
    constructor(db, googleMapsService) {
        this.db = db;
        this.googleMapsService = googleMapsService;
    }
    async getParkingSpots(location, radius = 1000, filters) {
        try {
            // Get real parking spots from Google Maps
            const realSpots = await this.getRealParkingSpots(location, radius);
            // Get demo spots from Firestore
            const demoSpots = await this.getDemoParkingSpots(location, radius);
            // Combine and filter results
            let allSpots = [...realSpots, ...demoSpots];
            // Calculate distances
            allSpots = allSpots.map(spot => ({
                ...spot,
                distance: this.googleMapsService.calculateDistance(location.lat, location.lng, spot.coordinates.latitude, spot.coordinates.longitude)
            }));
            // Filter by radius
            allSpots = allSpots.filter(spot => spot.distance <= radius);
            // Apply additional filters
            if (filters) {
                allSpots = this.applyFilters(allSpots, filters);
            }
            // Sort by distance and availability
            allSpots.sort((a, b) => {
                // Prioritize real spots
                if (a.isRealSpot && !b.isRealSpot)
                    return -1;
                if (!a.isRealSpot && b.isRealSpot)
                    return 1;
                // Then by distance
                if (Math.abs(a.distance - b.distance) < 100) {
                    // If distances are similar, prioritize availability
                    return b.availability.current - a.availability.current;
                }
                return a.distance - b.distance;
            });
            logger_1.logger.info(`Returning ${allSpots.length} parking spots (${realSpots.length} real, ${demoSpots.length} demo)`);
            return allSpots;
        }
        catch (error) {
            logger_1.logger.error('Error getting parking spots:', error);
            throw error;
        }
    }
    async getRealParkingSpots(location, radius) {
        try {
            const places = await this.googleMapsService.nearbySearch({
                location,
                radius,
                type: 'parking',
                keyword: 'parking',
            });
            return places.map((place) => this.convertPlaceToParkingSpot(place));
        }
        catch (error) {
            logger_1.logger.error('Error getting real parking spots:', error);
            return [];
        }
    }
    async getDemoParkingSpots(location, radius) {
        try {
            const snapshot = await this.db.collection('demo_parking_spots').get();
            const spots = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const spot = {
                    id: doc.id,
                    name: data.name,
                    address: data.address,
                    coordinates: {
                        latitude: data.coordinates.latitude,
                        longitude: data.coordinates.longitude,
                    },
                    availability: {
                        current: data.availability.current,
                        total: data.availability.total,
                        lastUpdated: data.availability.lastUpdated,
                    },
                    pricing: data.pricing,
                    features: data.features,
                    rating: data.rating,
                    type: data.type,
                    isRealSpot: false,
                    source: 'demo',
                    images: data.images || [],
                };
                spots.push(spot);
            });
            return spots;
        }
        catch (error) {
            logger_1.logger.error('Error getting demo parking spots:', error);
            return [];
        }
    }
    convertPlaceToParkingSpot(place) {
        // Generate realistic availability based on time and place type
        const hour = new Date().getHours();
        let availability = Math.floor(Math.random() * 50) + 10;
        if (hour >= 8 && hour <= 18) {
            availability = Math.floor(Math.random() * 30) + 5;
        }
        else if (hour >= 19 && hour <= 23) {
            availability = Math.floor(Math.random() * 40) + 10;
        }
        else {
            availability = Math.floor(Math.random() * 60) + 20;
        }
        // Generate realistic pricing based on place type
        let hourlyPrice = "Free";
        if (place.types?.includes('shopping_mall') || place.name?.toLowerCase().includes('shopping')) {
            hourlyPrice = Math.random() > 0.3 ? "3 PLN/h" : "4 PLN/h";
        }
        else if (place.types?.includes('transit_station') || place.name?.toLowerCase().includes('station')) {
            hourlyPrice = Math.random() > 0.4 ? "4 PLN/h" : "5 PLN/h";
        }
        else if (place.name?.toLowerCase().includes('airport') || place.name?.toLowerCase().includes('lotnisko')) {
            hourlyPrice = Math.random() > 0.3 ? "6 PLN/h" : "8 PLN/h";
        }
        else if (place.types?.includes('establishment')) {
            hourlyPrice = Math.random() > 0.5 ? "2 PLN/h" : "3 PLN/h";
        }
        // Generate features based on place type
        const features = [];
        if (place.types?.includes('shopping_mall') || place.name?.toLowerCase().includes('shopping')) {
            features.push('Covered', 'Security', 'Free WiFi', 'Family Friendly');
        }
        else if (place.types?.includes('transit_station') || place.name?.toLowerCase().includes('station')) {
            features.push('Covered', 'Security', '24/7', 'Cameras');
        }
        else if (place.name?.toLowerCase().includes('airport') || place.name?.toLowerCase().includes('lotnisko')) {
            features.push('Covered', 'Security', '24/7', 'Cameras', 'Lighting', 'Premium');
        }
        else if (place.types?.includes('establishment')) {
            features.push('Security', 'Business Area');
        }
        else {
            features.push('Security', 'Verified Location');
        }
        if (Math.random() > 0.7)
            features.push('EV Charging');
        if (Math.random() > 0.8)
            features.push('Disabled Access');
        if (Math.random() > 0.6)
            features.push('Lighting');
        // Determine parking type
        let parkingType = 'street';
        if (place.types?.includes('shopping_mall') || place.name?.toLowerCase().includes('shopping')) {
            parkingType = 'mall';
        }
        else if (place.types?.includes('transit_station') || place.name?.toLowerCase().includes('station')) {
            parkingType = 'transport';
        }
        else if (place.name?.toLowerCase().includes('airport') || place.name?.toLowerCase().includes('lotnisko')) {
            parkingType = 'transport';
        }
        else if (place.types?.includes('establishment')) {
            parkingType = 'office';
        }
        else if (place.types?.includes('parking')) {
            parkingType = 'public';
        }
        return {
            id: `real_${place.place_id}`,
            name: place.name,
            address: place.formatted_address,
            coordinates: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
            },
            availability: {
                current: availability,
                total: Math.floor(availability * (1.5 + Math.random() * 1.5)),
                lastUpdated: new Date().toISOString(),
            },
            pricing: {
                hourly: hourlyPrice,
                currency: 'PLN',
            },
            features,
            rating: (place.rating || 4.0) + (Math.random() * 0.5 - 0.25),
            type: parkingType,
            isRealSpot: true,
            source: 'google_maps',
            images: [],
        };
    }
    applyFilters(spots, filters) {
        let filtered = spots;
        // Filter by price range
        if (filters.priceRange) {
            filtered = filtered.filter(spot => {
                const price = this.extractPrice(spot.pricing.hourly);
                return price >= filters.priceRange.min && price <= filters.priceRange.max;
            });
        }
        // Filter by types
        if (filters.types && filters.types.length > 0) {
            filtered = filtered.filter(spot => filters.types.includes(spot.type));
        }
        // Filter by features
        if (filters.features && filters.features.length > 0) {
            filtered = filtered.filter(spot => filters.features.every((feature) => spot.features.includes(feature)));
        }
        // Filter by availability
        if (filters.availability) {
            filtered = filtered.filter(spot => spot.availability.current > 0);
        }
        return filtered;
    }
    extractPrice(priceString) {
        if (priceString.toLowerCase().includes('free'))
            return 0;
        const match = priceString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    async searchParkingSpots(query, location) {
        try {
            const places = await this.googleMapsService.textSearch(query, location);
            return places.map(place => this.convertPlaceToParkingSpot(place));
        }
        catch (error) {
            logger_1.logger.error('Error searching parking spots:', error);
            throw error;
        }
    }
    async getParkingSpot(id) {
        try {
            if (id.startsWith('real_')) {
                // This is a real spot, we can't get individual details from Google Places
                // Return a basic structure or fetch from cache
                return null;
            }
            else {
                // This is a demo spot, get from Firestore
                const doc = await this.db.collection('demo_parking_spots').doc(id).get();
                if (!doc.exists)
                    return null;
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    address: data.address,
                    coordinates: {
                        latitude: data.coordinates.latitude,
                        longitude: data.coordinates.longitude,
                    },
                    availability: {
                        current: data.availability.current,
                        total: data.availability.total,
                        lastUpdated: data.availability.lastUpdated,
                    },
                    pricing: data.pricing,
                    features: data.features,
                    rating: data.rating,
                    type: data.type,
                    isRealSpot: false,
                    source: 'demo',
                    images: data.images || [],
                };
            }
        }
        catch (error) {
            logger_1.logger.error('Error getting parking spot:', error);
            throw error;
        }
    }
}
exports.ParkingDataService = ParkingDataService;
//# sourceMappingURL=ParkingDataService.js.map
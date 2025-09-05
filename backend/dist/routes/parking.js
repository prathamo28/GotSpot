"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ParkingDataService_1 = require("../services/ParkingDataService");
const GoogleMapsService_1 = require("../services/GoogleMapsService");
const firestore_1 = require("firebase-admin/firestore");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// Initialize services
const db = (0, firestore_1.getFirestore)();
const googleMapsService = new GoogleMapsService_1.GoogleMapsService();
const parkingDataService = new ParkingDataService_1.ParkingDataService(db, googleMapsService);
// Get parking spots
router.get('/spots', async (req, res) => {
    try {
        const { lat, lng, radius = 1000, types, features, availability } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
        const location = {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        };
        const filters = {
            radius: parseInt(radius),
            types: types ? types.split(',') : undefined,
            features: features ? features.split(',') : undefined,
            availability: availability === 'true'
        };
        const spots = await parkingDataService.getParkingSpots(location, filters.radius, filters);
        logger_1.logger.info(`Found ${spots.length} parking spots for location: ${lat}, ${lng}`);
        res.json(spots);
    }
    catch (error) {
        logger_1.logger.error('Error getting parking spots:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get specific parking spot
router.get('/spots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const spot = await parkingDataService.getParkingSpot(id);
        if (!spot) {
            return res.status(404).json({ error: 'Parking spot not found' });
        }
        res.json(spot);
    }
    catch (error) {
        logger_1.logger.error('Error getting parking spot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Search parking spots
router.get('/search', async (req, res) => {
    try {
        const { query, lat, lng } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const location = lat && lng ? {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        } : undefined;
        const spots = await parkingDataService.searchParkingSpots(query, location);
        logger_1.logger.info(`Found ${spots.length} parking spots for query: ${query}`);
        res.json(spots);
    }
    catch (error) {
        logger_1.logger.error('Error searching parking spots:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update parking spot (admin only)
router.put('/spots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // For demo purposes, we'll just return the updated spot
        const spot = await parkingDataService.getParkingSpot(id);
        if (!spot) {
            return res.status(404).json({ error: 'Parking spot not found' });
        }
        const updatedSpot = { ...spot, ...updates, lastUpdated: new Date().toISOString() };
        logger_1.logger.info(`Updated parking spot: ${id}`);
        res.json(updatedSpot);
    }
    catch (error) {
        logger_1.logger.error('Error updating parking spot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=parking.js.map
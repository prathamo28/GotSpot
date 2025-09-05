import express from 'express';
import { ParkingDataService } from '../services/ParkingDataService';
import { GoogleMapsService } from '../services/GoogleMapsService';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from '../utils/logger';

const router: express.Router = express.Router();

// Initialize services
const db = getFirestore();
const googleMapsService = new GoogleMapsService();
const parkingDataService = new ParkingDataService(db, googleMapsService);

// Get parking spots
router.get('/spots', async (req, res) => {
  try {
    const { lat, lng, radius = 1000, types, features, availability } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const location = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    };

    const filters = {
      radius: parseInt(radius as string),
      types: types ? (types as string).split(',') : undefined,
      features: features ? (features as string).split(',') : undefined,
      availability: availability === 'true'
    };

    const spots = await parkingDataService.getParkingSpots(location, filters.radius, filters);
    
    logger.info(`Found ${spots.length} parking spots for location: ${lat}, ${lng}`);
    res.json(spots);
  } catch (error) {
    logger.error('Error getting parking spots:', error);
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
  } catch (error) {
    logger.error('Error getting parking spot:', error);
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
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    } : undefined;

    const spots = await parkingDataService.searchParkingSpots(query as string, location);
    
    logger.info(`Found ${spots.length} parking spots for query: ${query}`);
    res.json(spots);
  } catch (error) {
    logger.error('Error searching parking spots:', error);
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
    
    logger.info(`Updated parking spot: ${id}`);
    res.json(updatedSpot);
  } catch (error) {
    logger.error('Error updating parking spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

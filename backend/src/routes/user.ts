import express from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // For demo purposes, return a mock user profile
    const user = {
      id: 'demo-user',
      email: 'demo@gotspot.com',
      name: 'Demo User',
      preferences: {
        city: 'gdansk',
        notifications: true,
        searchRadius: 1000,
        favoriteTypes: ['mall', 'office']
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    res.json(user);
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const updates = req.body;
    
    // For demo purposes, return the updated profile
    const user = {
      id: 'demo-user',
      email: 'demo@gotspot.com',
      name: 'Demo User',
      preferences: {
        city: 'gdansk',
        notifications: true,
        searchRadius: 1000,
        favoriteTypes: ['mall', 'office'],
        ...updates.preferences
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      ...updates
    };

    logger.info('User profile updated');
    res.json(user);
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user favorites
router.get('/favorites', async (req, res) => {
  try {
    // For demo purposes, return empty favorites
    res.json([]);
  } catch (error) {
    logger.error('Error getting favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to favorites
router.post('/favorites', async (req, res) => {
  try {
    const { spotId } = req.body;
    
    if (!spotId) {
      return res.status(400).json({ error: 'Spot ID is required' });
    }

    logger.info(`Added spot ${spotId} to favorites`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from favorites
router.delete('/favorites/:spotId', async (req, res) => {
  try {
    const { spotId } = req.params;
    
    logger.info(`Removed spot ${spotId} from favorites`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

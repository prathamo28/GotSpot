"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
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
    }
    catch (error) {
        logger_1.logger.error('Error getting user profile:', error);
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
        logger_1.logger.info('User profile updated');
        res.json(user);
    }
    catch (error) {
        logger_1.logger.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get user favorites
router.get('/favorites', async (req, res) => {
    try {
        // For demo purposes, return empty favorites
        res.json([]);
    }
    catch (error) {
        logger_1.logger.error('Error getting favorites:', error);
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
        logger_1.logger.info(`Added spot ${spotId} to favorites`);
        res.json({ success: true });
    }
    catch (error) {
        logger_1.logger.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Remove from favorites
router.delete('/favorites/:spotId', async (req, res) => {
    try {
        const { spotId } = req.params;
        logger_1.logger.info(`Removed spot ${spotId} from favorites`);
        res.json({ success: true });
    }
    catch (error) {
        logger_1.logger.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map
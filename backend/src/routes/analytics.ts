import express from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

// Track event
router.post('/track', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    // Log the event for analytics
    logger.info(`Analytics event: ${event}`, { data, timestamp: new Date().toISOString() });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error tracking event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

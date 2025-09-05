"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// Track event
router.post('/track', async (req, res) => {
    try {
        const { event, data } = req.body;
        if (!event) {
            return res.status(400).json({ error: 'Event name is required' });
        }
        // Log the event for analytics
        logger_1.logger.info(`Analytics event: ${event}`, { data, timestamp: new Date().toISOString() });
        res.json({ success: true });
    }
    catch (error) {
        logger_1.logger.error('Error tracking event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map
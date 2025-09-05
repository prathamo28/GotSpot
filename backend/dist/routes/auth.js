"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // For demo purposes, we'll use a simple password check
        // In production, you'd verify against your user database
        if (password === 'gotspot2025') {
            const token = jsonwebtoken_1.default.sign({ email, userId: 'demo-user' }, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '24h' });
            const user = {
                id: 'demo-user',
                email,
                name: 'Demo User',
                createdAt: new Date().toISOString()
            };
            logger_1.logger.info(`User logged in: ${email}`);
            res.json({ token, user });
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // For demo purposes, we'll create a simple user
        const token = jsonwebtoken_1.default.sign({ email, userId: 'demo-user' }, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '24h' });
        const user = {
            id: 'demo-user',
            email,
            name,
            createdAt: new Date().toISOString()
        };
        logger_1.logger.info(`User registered: ${email}`);
        res.json({ token, user });
    }
    catch (error) {
        logger_1.logger.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'demo-secret');
        const newToken = jsonwebtoken_1.default.sign({ email: decoded.email, userId: decoded.userId }, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '24h' });
        res.json({ token: newToken });
    }
    catch (error) {
        logger_1.logger.error('Token refresh error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map
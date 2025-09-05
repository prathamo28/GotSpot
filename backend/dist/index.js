"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
// Import routes
const auth_2 = __importDefault(require("./routes/auth"));
const parking_1 = __importDefault(require("./routes/parking"));
const user_1 = __importDefault(require("./routes/user"));
const analytics_1 = __importDefault(require("./routes/analytics"));
// Import services
const GoogleMapsService_1 = require("./services/GoogleMapsService");
const ParkingDataService_1 = require("./services/ParkingDataService");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Initialize Firebase Admin
const serviceAccount = require('../config/service-account.json');
(0, app_1.initializeApp)({
    credential: serviceAccount,
    projectId: process.env.FIREBASE_PROJECT_ID,
});
// Initialize services
const db = (0, firestore_1.getFirestore)();
const auth = (0, auth_1.getAuth)();
const googleMapsService = new GoogleMapsService_1.GoogleMapsService();
const parkingDataService = new ParkingDataService_1.ParkingDataService(db, googleMapsService);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}));
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});
// API routes
app.use('/api/auth', auth_2.default);
app.use('/api/parking', parking_1.default);
app.use('/api/user', user_1.default);
app.use('/api/analytics', analytics_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.logger.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 GotSpot API server running on port ${PORT}`);
    logger_1.logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.logger.info(`🗺️ Google Maps API: ${googleMapsService.isConfigured() ? 'Configured' : 'Not configured'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map
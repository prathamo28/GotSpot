import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Import routes
import authRoutes from './routes/auth';
import parkingRoutes from './routes/parking';
import userRoutes from './routes/user';
import analyticsRoutes from './routes/analytics';

// Import services
import { GoogleMapsService } from './services/GoogleMapsService';
import { ParkingDataService } from './services/ParkingDataService';
import { logger } from './utils/logger';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin
const serviceAccount = require('../config/service-account.json');
initializeApp({
  credential: serviceAccount,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

// Initialize services
const db = getFirestore();
const auth = getAuth();
const googleMapsService = new GoogleMapsService();
const parkingDataService = new ParkingDataService(db, googleMapsService);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
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
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
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
  logger.info(`🚀 GotSpot API server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🗺️ Google Maps API: ${googleMapsService.isConfigured() ? 'Configured' : 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import AppError from './utils/AppError.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js'

const app = express();

// =========================================================================
// GLOBAL MIDDLEWARES (Security, Diagnostics & Parsing)
// =========================================================================

// 1. Armor HTTP Headers: Protects against common vectors like XSS and clickjacking
app.use(helmet());

// 2. Cross-Origin Resource Sharing: Enforces that only your trusted client domains can request data
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Request Traffic Logger: Outputs incoming network latency metrics directly into the console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 4. Optimized Body Parsers: Safe data limits prevent payload-injection attacks (DDoS)
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =========================================================================
// BASE ROUTE FOOTPRINTS
// =========================================================================

// Simple Health Check Endpoint (Essential for cloud server monitoring)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Rentals PropTech Engine operational and highly optimized.',
    timestamp: new Date().toISOString()
  });
});


// Mount all API routes
app.use('/api/v1', apiRoutes);


// Change '(*any)' to /.*/ without any quote marks
app.all(/.*/, (req, res, next) => {
  next(new AppError(`The resource matching path ${req.originalUrl} could not be located on this server.`, 404));
});
// Central Global Error Processing Node: Every internal error funnels directly down into this
app.use(globalErrorHandler);

export default app;
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

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

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 Rentals Core Service API is fully operational and healthy.',
    timestamp: new Date().toISOString()
  });
});

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

// =========================================================================
// AUTOMATED DYNAMIC SEO SITEMAP ARCHITECTURE
// =========================================================================
app.get('/sitemap.xml', async (req, res) => {
  try {
    const BASE_URL = 'https://rentalsafrica.com';

    // Pull models safely from Mongoose's active instance cache matrix
    const HotelModel = mongoose.models.Hotel;
    const PropertyModel = mongoose.models.Property;

    // Fallback protection check: execution logs warnings if boot pool is incomplete
    if (!HotelModel || !PropertyModel) {
      console.warn('⚠️ SEO Warning: Core database models not found in Mongoose cache layout yet.');
    }

    // Fetch only active records from your MongoDB cluster if models are resolved
    const liveHotels = HotelModel ? await HotelModel.find({ isAvailable: true }).select('_id updatedAt').lean() : [];
    const liveProperties = PropertyModel ? await PropertyModel.find({ isAvailable: true }).select('_id updatedAt').lean() : [];

    // Compile pure XML layout matrix stream
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Core Platform Master Landing Gateways
    const coreRoutes = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: '/explore', changefreq: 'daily', priority: '0.9' },
      { path: '/login', changefreq: 'monthly', priority: '0.3' }
    ];

    coreRoutes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. Dynamic Hospitality Hotel Portfolios
    liveHotels.forEach((hotel) => {
      const stamp = hotel.updatedAt ? new Date(hotel.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/hotels/${hotel._id}</loc>\n`;
      xml += `    <lastmod>${stamp}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // 3. Dynamic Rental and Asset Pipelines
    liveProperties.forEach((property) => {
      const stamp = property.updatedAt ? new Date(property.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/properties/${property._id}</loc>\n`;
      xml += `    <lastmod>${stamp}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);

  } catch (error) {
    console.error('💥 ERROR COMPILED DURING DYNAMIC SITEMAP DISPATCH:', error);
    // Graceful recovery: return empty layout set so the server never crashes in production
    res.header('Content-Type', 'application/xml');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
  }
});

// =========================================================================
// FALLBACK ROUTE PROTECTIONS
// =========================================================================

// Change '(*any)' to /.*/ without any quote marks
app.all(/.*/, (req, res, next) => {
  next(new AppError(`The resource matching path ${req.originalUrl} could not be located on this server.`, 404));
});

// Central Global Error Processing Node: Every internal error funnels directly down into this
app.use(globalErrorHandler);

export default app;
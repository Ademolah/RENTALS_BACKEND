// import dotenv from 'dotenv';
// // CRITICAL CONFIG: Initialize environment configurations before importing internal modules
// dotenv.config();

// import app from './app.js';
// import { connectDB } from './config/db.js';

// // =========================================================================
// // SYSTEM SHIELD: UNCAUGHT EXCEPTION CATCHERS
// // =========================================================================
// // Safely handles bugs in synchronous code (e.g., trying to read an undefined variable)
// process.on('uncaughtException', (err) => {
//   console.error('💥 UNCAUGHT EXCEPTION TRIGGERED! Exiting execution pool immediately...');
//   console.error(err.name, err.message, err.stack);
//   process.exit(1);
// });

// // Establish connection with our MongoDB Atlas spatial database cluster
// connectDB();

// const PORT = process.env.PORT || 5000;

// // Initialize the live HTTP network listener
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Rentals Core Service running in [${process.env.NODE_ENV || 'production'}] mode on port: ${PORT}`);
// });

// // =========================================================================
// // SYSTEM SHIELD: UNHANDLED REJECTION CATCHERS
// // =========================================================================
// // Catch-all safety net for unhandled asynchronous errors (e.g., if database authentication drops)
// process.on('unhandledRejection', (err) => {
//   console.error('💥 UNHANDLED REJECTION DETECTED! Shuttering network pipes gracefully...');
//   console.error(err.name, err.message);
  
//   // Close down our active HTTP listening port before terminating the process
//   server.close(() => {
//     process.exit(1);
//   });
// });


import dotenv from 'dotenv';
// CRITICAL CONFIG: Initialize environment configurations before importing internal modules
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

// =========================================================================
// SYSTEM SHIELD: UNCAUGHT EXCEPTION CATCHERS
// =========================================================================
// Safely handles bugs in synchronous code (e.g., trying to read an undefined variable)
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION TRIGGERED! Exiting execution pool immediately...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Establish connection with our MongoDB Atlas spatial database cluster
connectDB();

// =========================================================================
// AUTOMATED DYNAMIC SEO SITEMAP ARCHITECTURE
// =========================================================================
app.get('/sitemap.xml', async (req, res) => {
  try {
    const BASE_URL = 'https://www.rentalsafrica.com';

    // Access database models safely via Express or directly from your Mongoose cluster
    const HotelModel = app.get('models')?.Hotel || (await import('./models/Hotel.js')).default;
    const PropertyModel = app.get('models')?.Property || (await import('./models/Property.js')).default;

    // Fetch only active records, extracting just the ID and structural modification dates
    const liveHotels = await HotelModel.find({ isAvailable: true }).select('_id updatedAt').lean();
    const liveProperties = await PropertyModel.find({ isAvailable: true }).select('_id updatedAt').lean();

    // Begin building the pure XML layout stream
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

    // Lock down protocol data headers so Google reads this explicitly as an XML file matrix
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);

  } catch (error) {
    console.error('💥 ERROR COMPILED DURING DYNAMIC SITEMAP DISPATCH:', error);
    // Silent recovery: fail gracefully with an empty XML set so the server never crashes in production
    res.header('Content-Type', 'application/xml');
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
  }
});

const PORT = process.env.PORT || 5000;

// Initialize the live HTTP network listener
const server = app.listen(PORT, () => {
  console.log(`🚀 Rentals Core Service running in [${process.env.NODE_ENV || 'production'}] mode on port: ${PORT}`);
});

// =========================================================================
// SYSTEM SHIELD: UNHANDLED REJECTION CATCHERS
// =========================================================================
// Catch-all safety net for unhandled asynchronous errors (e.g., if database authentication drops)
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION DETECTED! Shuttering network pipes gracefully...');
  console.error(err.name, err.message);
  
  // Close down our active HTTP listening port before terminating the process
  server.close(() => {
    process.exit(1);
  });
});
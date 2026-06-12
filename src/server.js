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
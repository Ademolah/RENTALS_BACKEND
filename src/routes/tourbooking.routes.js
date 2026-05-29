import express from 'express';
import { requestTour, getAgencyBookings, updateBookingStatus } from '../controllers/tourBooking.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'; // Adjust paths

const router = express.Router();

// Publicly accessible route for explorers booking via the UI Modal
router.post('/request', requestTour);

// Secure routes protected by your existing authentication matrix
router.use(protectRoute);

// Only allow verified agency operatives to view the internal itinerary
router.get(
  '/workspace/itinerary', 
  protectRoute, 
  getAgencyBookings
);

router.patch('/:id/status', protectRoute, updateBookingStatus);

export default router;
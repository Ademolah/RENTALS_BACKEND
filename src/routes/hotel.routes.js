import { Router } from 'express';
import * as hotelController from '../controllers/hotel.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createHotelSchema } from '../validation/hotel.validation.js';
import { updateHotelSchema } from '../validation/hotel.validation.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import reviewRouter from './review.routes.js';

const router = Router();


router.use('/:hotelId/reviews', reviewRouter);

// 1. Surgical Media Interceptor Wrapper tailored for Hotels (Max 7 images)
const HotelUpload = (req, res, next) => {
  const multerUpload = upload.array('images', 7); // Optimized for our premium 7-image gallery threshold
  
  multerUpload(req, res, function (err) {
    if (err) {
      console.error('🚨 HOTEL MULTER CRASH:', err.message, err);
      return res.status(400).json({ error: 'Multer failed', details: err.message });
    }
    next();
  });
};

// 2. Custom Middleware to format flat Hotel FormData strings into strict types for Zod
const parseHotelMultipartBody = (req, res, next) => {
  if (req.body) {
    // Convert base numbers back to strict numbers for Zod
    if (req.body.starRating) req.body.starRating = Number(req.body.starRating);

    // Safely parse the stringified JSON array of amenities back into a real JS Array
    if (req.body.amenities && typeof req.body.amenities === 'string') {
      try {
        req.body.amenities = JSON.parse(req.body.amenities);
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid formatting inside amenities collection field.' 
        });
      }
    }

    // Safely parse the stringified room types array back into a real JS Array of Objects
    if (req.body.roomTypes && typeof req.body.roomTypes === 'string') {
      try {
        req.body.roomTypes = JSON.parse(req.body.roomTypes);
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid nested structure inside room variant configurations.' 
        });
      }
    }
  }
  next();
};


router.get('/owned-asset', protectRoute, hotelController.getOwnedHotelAsset);

// Authenticated Premium Ingestion Pipeline
router.post(
  '/', 
  protectRoute, 
  HotelUpload,
  parseHotelMultipartBody, // Intercepts, strips, and shapes text payloads
  validate(createHotelSchema),
  hotelController.listHotel
);

router.post('/submit', protectRoute, hotelController.submitApplication);
router.get('/my-status', protectRoute, hotelController.getMyApplication)

router.get('/admin/all', protectRoute, hotelController.getAllApplications);
router.patch('/admin/review/:applicationId', protectRoute, hotelController.reviewApplication);
router.patch(
  '/:id', 
  protectRoute, 
  HotelUpload,
  parseHotelMultipartBody,
  validate(updateHotelSchema), // Use the permissive schema here
  hotelController.updateHotel
);
router.delete('/:id', protectRoute, hotelController.deleteHotel)

// Public Search Route (Matches your existing bento grid feed patterns)
router.get('/', hotelController.searchHotels);
router.get('/:hotelId/reservations', protectRoute, hotelController.getHotelReservations);
router.route('/:id')
  .delete(hotelController.deleteReservation);

// Status Specific Hooks
router.patch('/:id/confirm', protectRoute, hotelController.confirmReservation);
router.patch('/:id/cancel', protectRoute, hotelController.cancelReservation);



export default router;
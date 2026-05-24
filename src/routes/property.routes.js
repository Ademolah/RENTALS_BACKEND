import { Router } from 'express';
import * as propertyController from '../controllers/property.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPropertySchema } from '../validation/property.validation.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer'
import {upload} from '../middleware/upload.middleware.js'



const router = Router();

const Upload = (req, res, next) => {
  const multerUpload = upload.array('images', 10);
  
  multerUpload(req, res, function (err) {
    if (err) {
      console.error('🚨 MULTER CRASH:', err.message, err);
      return res.status(400).json({ error: 'Multer failed', details: err.message });
    }
    next();
  });
};

// Endpoint: GET /api/v1/properties/nearby
// Public route: Anyone can search for properties near them
router.get('/', propertyController.getProperties);
router.delete('/:id',protectRoute, propertyController.deleteProperty)
router.patch('/:id', protectRoute, propertyController.updateProperty)
router.get('/nearby', propertyController.getNearbyProperties)


// Middleware to format flat FormData strings into the strict types Zod expects
const parseMultipartBody = (req, res, next) => {
  if (req.body) {
    // 1. Convert text strings back to strict numbers for Zod
    if (req.body.pricePerAnnum) req.body.pricePerAnnum = Number(req.body.pricePerAnnum);
    if (req.body.serviceCharge) req.body.serviceCharge = Number(req.body.serviceCharge);
    if (req.body.cautionFee) req.body.cautionFee = Number(req.body.cautionFee);
    if (req.body.beds) req.body.beds = Number(req.body.beds);
    if (req.body.baths) req.body.baths = Number(req.body.baths);

    // 2. Safely parse the stringified GeoJSON object back into a real object
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid GeoJSON geometry format inside location field.' 
        });
      }
    }
  }
  next();
};


router.post(
  '/', 
  protectRoute, 
  // upload.array('images', 10),
  Upload,
  parseMultipartBody,
  validate(createPropertySchema), 
  propertyController.createProperty
);

router.get('/search', propertyController.searchProperties)

export default router;
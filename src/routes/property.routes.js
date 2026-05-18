import { Router } from 'express';
import * as propertyController from '../controllers/property.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPropertySchema } from '../validation/property.validation.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint: GET /api/v1/properties/nearby
// Public route: Anyone can search for properties near them
router.get('/nearby', propertyController.getNearbyProperties);

// Endpoint: POST /api/v1/properties
// Protected route: You must be logged in AND pass the strict Zod validation
router.post(
  '/', 
  protectRoute, 
  validate(createPropertySchema), 
  propertyController.createProperty
);

export default router;
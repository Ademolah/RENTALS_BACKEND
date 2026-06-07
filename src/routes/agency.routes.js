import { Router } from 'express';
import * as agencyController from '../controllers/agency.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerAgencySchema } from '../validation/agency.validation.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint: POST /api/v1/agencies
// Protected: The user must be logged in to register a firm
router.post(
  '/',
  protectRoute,
  validate(registerAgencySchema),
  agencyController.registerAgency
);

router.get('/agents', protectRoute, agencyController.getAgencyAgents)



export default router;
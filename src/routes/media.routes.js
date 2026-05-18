import { Router } from 'express';
import * as mediaController from '../controllers/media.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint: GET /api/v1/media/signature
// Protected: Only logged-in users with valid JWT tokens can hit this endpoint
router.get('/signature', protectRoute, mediaController.getUploadSignature);

export default router;
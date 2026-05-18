import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Mount all authentication routes under /auth
router.use('/auth', authRoutes);

export default router;
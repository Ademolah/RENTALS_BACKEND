import { Router } from 'express';
import authRoutes from './auth.routes.js';
import mediaRoutes from './media.routes.js'
import propertyRoutes from './property.routes.js'

const router = Router();

// Mount all authentication routes under /auth
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/properties', propertyRoutes)

export default router;
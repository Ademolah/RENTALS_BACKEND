import { Router } from 'express';
import authRoutes from './auth.routes.js';
import mediaRoutes from './media.routes.js'
import propertyRoutes from './property.routes.js'
import agencyRoute from './agency.routes.js'
import adminRoute from './admin.routes.js'

const router = Router();

// Mount all authentication routes under /auth
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/properties', propertyRoutes)
router.use('/agencies', agencyRoute)
router.use('/admin', adminRoute)

export default router;
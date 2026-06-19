import { Router } from 'express';
import authRoutes from './auth.routes.js';
import mediaRoutes from './media.routes.js'
import propertyRoutes from './property.routes.js'
import agencyRoute from './agency.routes.js'
import adminRoute from './admin.routes.js'
import tourBookingRoute from './tourbooking.routes.js'
import hotelRoute from './hotel.routes.js'
import reservationRoute from './reservation.routes.js'
import reviewRoute from './review.routes.js'

const router = Router();

// Mount all authentication routes under /auth
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/properties', propertyRoutes)
router.use('/agencies', agencyRoute)
router.use('/admin', adminRoute)
router.use('/bookings', tourBookingRoute)
router.use('/hotels', hotelRoute)
router.use('/reservations', reservationRoute)
router.use('/reviews', reviewRoute)
export default router;
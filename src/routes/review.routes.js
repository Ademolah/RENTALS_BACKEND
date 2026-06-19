import express from 'express';
import { createReview , getHotelReviews} from '../controllers/review.controller.js';
import { protectRoute} from '../middleware/auth.middleware.js';

// mergeParams: true allows this router to access the :hotelId from the parent hotel router
const router = express.Router({ mergeParams: true });


// Only standard users can leave reviews (preventing agencies/admins from faking reviews)
router.post('/',protectRoute, createReview);
router.get('/', getHotelReviews )

export default router;
import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js'


const router = Router();


router.get('/applications', protectRoute, adminController.getPendingApplications);
router.patch('/applications/:id/review', protectRoute, adminController.reviewApplication);

export default router;
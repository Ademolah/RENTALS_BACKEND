import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js'


const router = Router();


router.get('/agencies', protectRoute, adminController.getPendingAgencies)
router.patch('/agency/:id/review', protectRoute, adminController.reviewCorporateAgency)

export default router;
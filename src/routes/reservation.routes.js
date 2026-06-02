import express from 'express';
import { createReservation, getAdminDashboardFeed } from '../controllers/reservation.controller.js';

const router = express.Router();

router.route('/')
  .post(createReservation)
  .get(getAdminDashboardFeed);

export default router;
import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { supabaseAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', supabaseAuthMiddleware, bookingController.getUserBookings);
router.post('/', supabaseAuthMiddleware, bookingController.createBooking);
router.get('/:id', supabaseAuthMiddleware, bookingController.getBookingDetails);

export default router;

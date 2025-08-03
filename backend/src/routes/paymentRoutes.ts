import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { supabaseAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', supabaseAuthMiddleware, paymentController.getAllPayments);
router.get('/booking/:booking_id', supabaseAuthMiddleware, paymentController.getPaymentByBooking);
router.post('/', supabaseAuthMiddleware, paymentController.createPayment);
router.put('/:id', supabaseAuthMiddleware, paymentController.updatePayment);
router.delete('/:id', supabaseAuthMiddleware, paymentController.deletePayment);

export default router;

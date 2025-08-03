import { Router } from 'express';
import * as userController from '../controllers/userController';
import { supabaseAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', supabaseAuthMiddleware, userController.getUserProfile);
router.put('/profile', supabaseAuthMiddleware, userController.updateUserProfile);

// Admin routes
router.get('/all', supabaseAuthMiddleware, userController.getAllUsers);

export default router;

import { Router } from 'express';
import * as usageController from '../controllers/promotionUsageController';
import { supabaseAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', supabaseAuthMiddleware, usageController.getAllPromotionUsages);
router.get('/user/:user_id', supabaseAuthMiddleware, usageController.getPromotionUsagesByUser);
router.post('/', supabaseAuthMiddleware, usageController.createPromotionUsage);

export default router;

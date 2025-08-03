import { Router } from 'express';
import * as promotionController from '../controllers/promotionController';
import { supabaseAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', promotionController.getAllPromotions);
router.get('/:code', promotionController.getPromotionByCode);
router.post('/', supabaseAuthMiddleware, promotionController.createPromotion);
router.put('/:id', supabaseAuthMiddleware, promotionController.updatePromotion);
router.delete('/:id', supabaseAuthMiddleware, promotionController.deletePromotion);

export default router;

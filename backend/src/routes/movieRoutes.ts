import { Router } from 'express';
import * as movieController from '../controllers/movieController';
import { supabaseAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

router.post('/', supabaseAuthMiddleware, movieController.createMovie);
router.put('/:id', supabaseAuthMiddleware, movieController.updateMovie);
router.delete('/:id', supabaseAuthMiddleware, movieController.deleteMovie);

export default router;

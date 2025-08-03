import { Router } from "express";
import * as cinemaController from "../controllers/cinemaController";
import { supabaseAuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", cinemaController.getAllCinemas);
router.get("/:id", cinemaController.getCinemaById);

router.post("/", supabaseAuthMiddleware, cinemaController.createCinema);
router.put("/:id", supabaseAuthMiddleware, cinemaController.updateCinema);
router.delete("/:id", supabaseAuthMiddleware, cinemaController.deleteCinema);

export default router;

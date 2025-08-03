import { Router } from "express";
import * as showtimeController from "../controllers/showtimeController";
import { supabaseAuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", showtimeController.getAllShowtimes);
router.get("/:id", showtimeController.getShowtimeById);

router.post("/", supabaseAuthMiddleware, showtimeController.createShowtime);
router.put("/:id", supabaseAuthMiddleware, showtimeController.updateShowtime);
router.delete("/:id", supabaseAuthMiddleware, showtimeController.deleteShowtime);

export default router;

import { Router } from "express";
import * as theaterController from "../controllers/theaterController";
import { supabaseAuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", theaterController.getAllTheaters);
router.get("/:id", theaterController.getTheaterById);

router.post("/", supabaseAuthMiddleware, theaterController.createTheater);
router.put("/:id", supabaseAuthMiddleware, theaterController.updateTheater);
router.delete("/:id", supabaseAuthMiddleware, theaterController.deleteTheater);

export default router;

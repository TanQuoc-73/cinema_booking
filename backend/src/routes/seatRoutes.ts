import { Router } from "express";
import * as seatController from "../controllers/seatController";
import { supabaseAuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Lấy danh sách ghế theo phòng chiếu
router.get("/theater/:theater_id", seatController.getSeatsByTheater);

router.post("/", supabaseAuthMiddleware, seatController.createSeat);
router.put("/:id", supabaseAuthMiddleware, seatController.updateSeat);
router.delete("/:id", supabaseAuthMiddleware, seatController.deleteSeat);

export default router;

    import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";
import { Seat } from "../models/seatModel";

// Lấy danh sách ghế theo phòng chiếu (theater_id)
export const getSeatsByTheater = async (req: Request, res: Response) => {
  const theater_id = Number(req.params.theater_id);
  const { data, error } = await supabase
    .from("seats")
    .select("*")
    .eq("theater_id", theater_id)
    .eq("status", 1);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Thêm ghế mới
export const createSeat = async (req: Request, res: Response) => {
  const seat: Omit<Seat, "seat_id" | "created_at" | "updated_at"> = req.body;
  const { data, error } = await supabase
    .from("seats")
    .insert([seat])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Cập nhật ghế
export const updateSeat = async (req: Request, res: Response) => {
  const seat_id = Number(req.params.id);
  const seat = req.body;
  const { data, error } = await supabase
    .from("seats")
    .update(seat)
    .eq("seat_id", seat_id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Xóa mềm (đổi trạng thái)
export const deleteSeat = async (req: Request, res: Response) => {
  const seat_id = Number(req.params.id);
  const { error } = await supabase
    .from("seats")
    .update({ status: 0 })
    .eq("seat_id", seat_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Deleted successfully" });
};

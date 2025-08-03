import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";
import { Theater } from "../models/theaterModel";

// Lấy tất cả phòng chiếu
export const getAllTheaters = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("theaters").select("*").eq("status", 1);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Thêm phòng chiếu mới
export const createTheater = async (req: Request, res: Response) => {
  const theater: Omit<Theater, "theater_id" | "created_at" | "updated_at"> = req.body;
  const { data, error } = await supabase.from("theaters").insert([theater]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Xem chi tiết phòng chiếu
export const getTheaterById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase.from("theaters").select("*").eq("theater_id", id).single();
  if (error) return res.status(404).json({ error: "Theater not found" });
  res.json(data);
};

// Cập nhật phòng chiếu
export const updateTheater = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const theater = req.body;
  const { data, error } = await supabase.from("theaters").update(theater).eq("theater_id", id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Xóa mềm (cập nhật status)
export const deleteTheater = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { error } = await supabase.from("theaters").update({ status: 0 }).eq("theater_id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Deleted successfully" });
};

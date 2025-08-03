import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";
import { Showtime } from "../models/showtimeModel";

// Lấy tất cả suất chiếu (có thể filter phim hoặc phòng chiếu qua query param)
export const getAllShowtimes = async (req: Request, res: Response) => {
  const { movie_id, theater_id, date } = req.query;

  let query = supabase.from("showtimes").select("*").eq("status", 1);

  if (movie_id) query = query.eq("movie_id", Number(movie_id));
  if (theater_id) query = query.eq("theater_id", Number(theater_id));
  if (date) query = query.eq("show_date", date as string);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Tạo suất chiếu mới
export const createShowtime = async (req: Request, res: Response) => {
  const showtime: Omit<Showtime, "showtime_id" | "created_at" | "updated_at"> = req.body;
  const { data, error } = await supabase.from("showtimes").insert([showtime]).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Xem chi tiết suất chiếu
export const getShowtimeById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase.from("showtimes").select("*").eq("showtime_id", id).single();

  if (error) return res.status(404).json({ error: "Showtime not found" });
  res.json(data);
};

// Cập nhật suất chiếu
export const updateShowtime = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const showtime = req.body;
  const { data, error } = await supabase.from("showtimes").update(showtime).eq("showtime_id", id).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Xóa mềm (cập nhật status)
export const deleteShowtime = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { error } = await supabase.from("showtimes").update({ status: 0 }).eq("showtime_id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Deleted successfully" });
};

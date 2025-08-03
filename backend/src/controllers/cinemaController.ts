import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";
import { Cinema } from "../models/cinemaModel";

// Lấy tất cả rạp
export const getAllCinemas = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("cinemas").select("*").eq("status", 1);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Thêm rạp mới
export const createCinema = async (req: Request, res: Response) => {
  const cinema: Omit<Cinema, "cinema_id" | "created_at" | "updated_at"> = req.body;
  const { data, error } = await supabase.from("cinemas").insert([cinema]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Xem chi tiết rạp
export const getCinemaById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase.from("cinemas").select("*").eq("cinema_id", id).single();
  if (error) return res.status(404).json({ error: "Cinema not found" });
  res.json(data);
};

// Cập nhật rạp
export const updateCinema = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cinema = req.body;
  const { data, error } = await supabase.from("cinemas").update(cinema).eq("cinema_id", id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Xóa mềm (cập nhật status)
export const deleteCinema = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { error } = await supabase.from("cinemas").update({ status: 0 }).eq("cinema_id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Deleted successfully" });
};

import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { Promotion } from '../models/promotionModel';

// Lấy tất cả promotion
export const getAllPromotions = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('promotions').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Lấy promotion theo mã code
export const getPromotionByCode = async (req: Request, res: Response) => {
  const code = req.params.code;
  const { data, error } = await supabase.from('promotions').select('*').eq('code', code).single();
  if (error || !data) return res.status(404).json({ error: 'Promotion not found' });
  res.json(data);
};

// Tạo promotion mới
export const createPromotion = async (req: Request, res: Response) => {
  const promo: Omit<Promotion, 'promo_id' | 'created_at' | 'updated_at'> = req.body;
  const { data, error } = await supabase.from('promotions').insert([promo]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Cập nhật promotion
export const updatePromotion = async (req: Request, res: Response) => {
  const promo_id = Number(req.params.id);
  const updateData = req.body;
  const { data, error } = await supabase.from('promotions').update(updateData).eq('promo_id', promo_id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Xóa mềm promotion
export const deletePromotion = async (req: Request, res: Response) => {
  const promo_id = Number(req.params.id);
  const { error } = await supabase.from('promotions').update({ status: 0 }).eq('promo_id', promo_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted successfully' });
};

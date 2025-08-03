import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { PromotionUsage } from '../models/promotionUsageModel';

// Lấy tất cả usage
export const getAllPromotionUsages = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('promotion_usages').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Lấy usage theo user_id
export const getPromotionUsagesByUser = async (req: Request, res: Response) => {
  const user_id = req.params.user_id;
  const { data, error } = await supabase.from('promotion_usages').select('*').eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Tạo usage mới
export const createPromotionUsage = async (req: Request, res: Response) => {
  const usage: Omit<PromotionUsage, 'usage_id' | 'used_at'> = req.body;
  const { data, error } = await supabase.from('promotion_usages').insert([usage]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

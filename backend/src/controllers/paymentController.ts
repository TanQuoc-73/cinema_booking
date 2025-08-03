import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { Payment } from '../models/paymentModel';

// Lấy tất cả payment
export const getAllPayments = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('payments').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Lấy payment theo booking_id
export const getPaymentByBooking = async (req: Request, res: Response) => {
  const booking_id = Number(req.params.booking_id);
  const { data, error } = await supabase.from('payments').select('*').eq('booking_id', booking_id).single();
  if (error || !data) return res.status(404).json({ error: 'Payment not found' });
  res.json(data);
};

// Tạo payment mới
export const createPayment = async (req: Request, res: Response) => {
  const payment: Omit<Payment, 'payment_id' | 'created_at' | 'updated_at'> = req.body;
  const { data, error } = await supabase.from('payments').insert([payment]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Cập nhật payment
export const updatePayment = async (req: Request, res: Response) => {
  const payment_id = Number(req.params.id);
  const updateData = req.body;
  const { data, error } = await supabase.from('payments').update(updateData).eq('payment_id', payment_id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Xóa mềm payment
export const deletePayment = async (req: Request, res: Response) => {
  const payment_id = Number(req.params.id);
  const { error } = await supabase.from('payments').update({ status: 0 }).eq('payment_id', payment_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted successfully' });
};

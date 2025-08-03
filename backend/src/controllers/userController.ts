import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export interface AuthRequest extends Request {
  user?: any; // Đã được mở rộng trong middleware
}

// Lấy profile user đang đăng nhập
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user.db) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Trả về thông tin người dùng từ bảng users (bên db)
  res.json(req.user.db);
};

// Cập nhật thông tin user (full_name, phone,...)
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user.db) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user.db.user_id;
  const updateData = req.body;

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// (Tùy chọn) Lấy danh sách tất cả users - chỉ dành cho admin
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user.db) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Kiểm tra quyền (role)
  if (req.user.db.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: No permission' });
  }

  const { data, error } = await supabase.from('users').select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

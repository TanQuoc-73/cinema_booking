import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';

export interface AuthRequest extends Request {
  user?: any; // Supabase user + user db
}

// Middleware xác thực Supabase và mapping sang bảng users
export async function supabaseAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    // 1. Xác thực qua Supabase Admin API
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const supabaseUser = data.user;
    const email = supabaseUser?.email;
    if (!email) {
      return res.status(401).json({ error: 'No email in Supabase user' });
    }

    // 2. Tìm user ở bảng users dựa vào email
    let { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // 3. Nếu chưa tồn tại user trong bảng users, có thể tự động tạo mới
    if (dbError || !dbUser) {
      // Tuỳ phép logic, nếu muốn chỉ trả lỗi thì bỏ đoạn này
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email, status: 1 }])
        .select()
        .single();

      if (insertError) {
        return res.status(401).json({ error: 'Can not create user in database', details: insertError.message });
      }
      dbUser = newUser;
    }

    // 4. Gắn cả hai info vào req.user
    req.user = {
      ...supabaseUser, // các trường Supabase
      db: dbUser        // trường bổ sung từ bảng users app bạn
    };
    next();
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

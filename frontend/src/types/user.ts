// src/types/user.ts
export interface User {
  id: string;             // UUID Supabase Auth user id
  email: string | null;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  // Thêm các trường khác bạn có trong bảng users
}

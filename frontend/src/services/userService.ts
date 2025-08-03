import { User } from '@/types/user';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

// Lấy user theo id
export async function fetchUserById(id: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Lấy thông tin user lỗi');
  return res.json();
}

// Update user (PUT: /users/:id)
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Cập nhật user lỗi');
  return res.json();
}

// Upsert user (POST: /users)
// Gửi thông tin user để tạo mới hoặc cập nhật (tùy backend của bạn xử lý)
export async function upsertUser(user: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Upsert user failed');
  return res.json();
}

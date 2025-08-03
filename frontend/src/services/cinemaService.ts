export async function fetchCinemas() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
  const res = await fetch(`${API_BASE}/cinemas`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Lỗi lấy danh sách rạp');
  return res.json();
}

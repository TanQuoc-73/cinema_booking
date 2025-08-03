export async function fetchSeats(theaterId: number) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
  const res = await fetch(`${API_BASE}/seats/theater/${theaterId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Lỗi lấy danh sách ghế');
  return res.json();
}

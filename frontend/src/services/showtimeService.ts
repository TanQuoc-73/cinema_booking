export async function fetchShowtimes(movieId: number, cinemaId: number) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
  const params = new URLSearchParams();
  params.append('movie_id', String(movieId));
  params.append('cinema_id', String(cinemaId));
  const res = await fetch(`${API_BASE}/showtimes?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Lỗi lấy suất chiếu');
  return res.json();
}

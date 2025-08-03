import { Movie } from '@/types/movie';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

// Kết quả trả về của API phân trang
export interface MovieListResponse {
  data: Movie[];
  count: number;
  page: number;
  limit: number;
}

// Lấy danh sách phim có phân trang
export async function fetchMovies(
  page = 1,
  limit = 12,
  search: string = '',
  status: number | null = null
): Promise<MovieListResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (search) params.append('search', search);
  if (status !== null && status !== undefined) params.append('status', String(status));

  const url = `${API_BASE}/movies?${params.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Lấy danh sách phim lỗi');
  return res.json();
}

// Lấy chi tiết một phim
export async function fetchMovieDetail(id: number | string): Promise<Movie> {
  const url = `${API_BASE}/movies/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Lấy chi tiết phim lỗi');
  return res.json();
}

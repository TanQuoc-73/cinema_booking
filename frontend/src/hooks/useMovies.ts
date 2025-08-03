import { useEffect, useState } from 'react';
import { fetchMovies, MovieListResponse } from '@/services/moviesService';
import { Movie } from '@/types/movie';

const PAGE_SIZE = 12;

export function useMovies(
  page: number = 1,
  limit: number = PAGE_SIZE,
  search: string = '',
  status: number | null = null
) {
  // Chuẩn hóa giá trị search và status để dependency array size cố định, không bị undefined/null xen kẽ
  const normalizedSearch = search || '';
  const normalizedStatus = status === null || status === undefined ? -1 : status;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Gọi service với giá trị đã chuẩn hóa để tránh lỗi dependency array không ổn định
        const response: MovieListResponse = await fetchMovies(page, limit, normalizedSearch, normalizedStatus === -1 ? null : normalizedStatus);
        if (active) {
          setMovies(response.data);
          setTotal(response.count);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Lỗi lấy phim');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, limit, normalizedSearch, normalizedStatus]);

  return { movies, total, loading, error };
}

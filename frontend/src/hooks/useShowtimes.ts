import { useEffect, useState } from 'react';
import { fetchShowtimes } from '@/services/showtimeService';

export function useShowtimes(movieId: number | null, cinemaId: number | null) {
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !cinemaId) {
      setShowtimes([]);
      return;
    }
    setLoading(true);
    fetchShowtimes(movieId, cinemaId)
      .then(data => {
        setShowtimes(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [movieId, cinemaId]);

  return { showtimes, loading, error };
}

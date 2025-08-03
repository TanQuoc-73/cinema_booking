import { useEffect, useState } from 'react';
import { fetchSeats } from '@/services/seatService';

export function useSeats(theaterId: number | null) {
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!theaterId) {
      setSeats([]);
      return;
    }
    setLoading(true);
    fetchSeats(theaterId)
      .then(data => {
        setSeats(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [theaterId]);

  return { seats, loading, error };
}

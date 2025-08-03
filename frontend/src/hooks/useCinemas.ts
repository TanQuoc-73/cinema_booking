import { useEffect, useState } from 'react';
import { fetchCinemas } from '@/services/cinemaService';

export function useCinemas() {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCinemas()
      .then(data => {
        setCinemas(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { cinemas, loading, error };
}

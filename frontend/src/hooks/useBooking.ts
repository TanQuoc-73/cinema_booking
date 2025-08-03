import { useState } from 'react';
import { createBooking } from '@/services/bookingService';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);

  async function book({ showtimeId, seats, totalPrice, accessToken }: {
    showtimeId: number;
    seats: { seat_id: number; price: number }[];
    totalPrice: number;
    accessToken: string;
  }) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await createBooking({ showtimeId, seats, totalPrice, accessToken });
      setSuccess(result);
      return result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { book, loading, error, success };
}

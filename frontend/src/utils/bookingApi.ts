import { useAuth } from '../contexts/AuthContext';

export async function createBooking(bookingData: any, accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) throw new Error('Booking failed');
  return res.json();
}

// Ví dụ sử dụng trong component:
// const { accessToken } = useAuth();
// await createBooking({ showtime_id, seats, total_price }, accessToken);

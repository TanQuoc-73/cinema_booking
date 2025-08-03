export async function createBooking({ showtimeId, seats, totalPrice, accessToken }: {
  showtimeId: number;
  seats: { seat_id: number; price: number }[];
  totalPrice: number;
  accessToken: string;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      showtime_id: showtimeId,
      seats,
      total_price: totalPrice,
      payment_status: 0,
    }),
  });
  if (!res.ok) throw new Error('Lỗi đặt vé');
  return res.json();
}

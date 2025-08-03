export interface Booking {
  booking_id: number;
  user_id: number;
  showtime_id: number;
  booking_date: string; // timestamp
  total_price: number;
  payment_status: number; // 0 chưa thanh toán, 1 đã thanh toán
  status: number; // 1 active
  created_at: string;
  updated_at: string;
}

export interface BookingDetail {
  booking_detail_id: number;
  booking_id: number;
  seat_id: number;
  price: number;
  status: number;
  created_at: string;
  updated_at: string;
}
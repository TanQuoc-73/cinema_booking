import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { Booking, BookingDetail } from '../models/bookingModel';

interface AuthRequest extends Request {
  user?: any;
}

// Lấy tất cả booking của user
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.id || req.user?.user_id;
  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Tạo đặt vé mới (cùng lúc tạo booking và booking_details)
export const createBooking = async (req: AuthRequest, res: Response) => {
  /*
  req.body mẫu:
  {
    showtime_id: number;
    seats: [{ seat_id: number, price: number }]; 
    total_price: number;
    payment_status?: number; // option
  }
  */
  const user_id = req.user?.id || req.user?.user_id;
  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

  const { showtime_id, seats, total_price, payment_status = 0 } = req.body;

  if (!showtime_id || !Array.isArray(seats) || seats.length === 0 || !total_price) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  try {
    // Kiểm tra trạng thái ghế trước khi tạo booking
    const seatIds = seats.map((seat: { seat_id: number }) => seat.seat_id);
    const { data: seatStatusList, error: seatStatusError } = await supabase
      .from('seats')
      .select('seat_id, status')
      .in('seat_id', seatIds);
    if (seatStatusError) {
      return res.status(500).json({ error: seatStatusError.message || 'Không kiểm tra được trạng thái ghế' });
    }
    const unavailableSeats = seatStatusList.filter((s: any) => s.status !== 1);
    if (unavailableSeats.length > 0) {
      return res.status(409).json({ error: `Ghế đã bị đặt: ${unavailableSeats.map((s: any) => s.seat_id).join(', ')}` });
    }
    // Bắt đầu giao dịch nếu Supabase hỗ trợ (hiện Supabase chưa hỗ trợ transaction trực tiếp qua SDK, nên cần xử lý thủ công hoặc theo từng bước)
    
    // 1. Tạo booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{ user_id, showtime_id, total_price, payment_status, status: 1 }])
      .select()
      .single();

    if (bookingError || !booking) return res.status(400).json({ error: bookingError?.message || 'Failed to create booking' });

    // 2. Tạo booking_details cho từng ghế
    // Tạo mảng dữ liệu booking_details
    const bookingDetailsPayload = seats.map((seat: { seat_id: number; price: number }) => ({
      booking_id: booking.booking_id,
      seat_id: seat.seat_id,
      price: seat.price,
      status: 1,
    }));

    const { error: detailsError } = await supabase.from('booking_details').insert(bookingDetailsPayload);

    if (detailsError) {
      // Nếu lỗi, bạn có thể muốn xoá booking vừa tạo để tránh dữ liệu rác (phải chạy lại delete)
      await supabase.from('bookings').delete().eq('booking_id', booking.booking_id);
      return res.status(500).json({ error: detailsError.message });
    }

    // Có thể update trạng thái ghế (seat) hoặc xác nhận sau

    res.status(201).json({ booking, bookingDetails: bookingDetailsPayload });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Lấy chi tiết booking và ghế tương ứng
export const getBookingDetails = async (req: AuthRequest, res: Response) => {
  const booking_id = Number(req.params.id);
  const user_id = req.user?.id || req.user?.user_id;
  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

  // Kiểm tra booking thuộc user
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', booking_id)
    .eq('user_id', user_id)
    .single();

  if (bookingError || !booking) return res.status(404).json({ error: 'Booking not found' });

  // Lấy chi tiết ghế
  const { data: details, error: detailsError } = await supabase
    .from('booking_details')
    .select('*, seats(*)') // lấy thêm thông tin seat nếu muốn
    .eq('booking_id', booking_id);

  if (detailsError) return res.status(500).json({ error: detailsError.message });

  res.json({ booking, details });
};

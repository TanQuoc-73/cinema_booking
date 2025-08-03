export interface Payment {
  payment_id: number;
  booking_id: number;
  payment_method: number; // 1: Tiền mặt, 2: Thẻ, 3: Ví điện tử, ...
  amount: number;
  payment_time: string; // ISO string
  status: number;
  created_at: string;
  updated_at: string;
}

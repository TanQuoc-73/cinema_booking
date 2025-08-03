export interface Seat {
  seat_id: number;
  theater_id: number;
  seat_row: string;
  seat_number: number;
  seat_type: number; // 1: thường, 2: VIP, 3: đôi,...
  status: number;
  created_at: string;
  updated_at: string;
}

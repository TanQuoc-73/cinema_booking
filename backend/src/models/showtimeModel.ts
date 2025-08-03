export interface Showtime {
  showtime_id: number;
  movie_id: number;
  theater_id: number;
  show_date: string; // ISO date string (YYYY-MM-DD)
  show_time: string; // thời gian, dạng "HH:mm:ss"
  price: number; // decimal
  status: number;
  created_at: string;
  updated_at: string;
}

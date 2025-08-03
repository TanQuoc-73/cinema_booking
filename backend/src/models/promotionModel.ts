export interface Promotion {
  promo_id: number;
  code: string;
  description?: string;
  discount_percent?: number;
  discount_amount?: number;
  start_date: string; // ISO date
  end_date: string; // ISO date
  status: number;
  created_at: string;
  updated_at: string;
}

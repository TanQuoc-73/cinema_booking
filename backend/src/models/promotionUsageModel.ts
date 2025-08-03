export interface PromotionUsage {
  usage_id: number;
  promo_id: number;
  user_id: string; // UUID
  booking_id: number;
  used_at: string; // ISO string
}

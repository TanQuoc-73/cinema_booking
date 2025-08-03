export interface Movie {
  movie_id: number;
  title: string;
  description?: string;
  duration?: number;
  release_date?: string;
  poster_url?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

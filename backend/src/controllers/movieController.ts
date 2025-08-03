import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { Movie } from '../models/movieModel';

// Lấy danh sách phim (hỗ trợ phân trang, tìm kiếm, lọc trạng thái)
export const getAllMovies = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Lấy giá trị search và status từ query params
  const search = typeof req.query.search === 'string' && req.query.search.trim() !== '' 
    ? req.query.search.trim() 
    : null;

  const statusParam = req.query.status;
  const status = statusParam !== undefined && statusParam !== null && statusParam !== ''
    ? Number(statusParam)
    : null;

  let query = supabase
    .from('movies')
    .select('*', { count: 'exact' });

  // Lọc theo trạng thái phim nếu có, nếu không lấy mặc định phim đang chiếu
  if (status !== null && !isNaN(status)) {
    query = query.eq('status', status);
  } else {
    query = query.eq('status', 1);
  }

  // Tìm kiếm phim theo tên (case-insensitive)
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ data, count, page, limit });
};

// Các controller khác giữ nguyên
export const createMovie = async (req: Request, res: Response) => {
  const movie: Omit<Movie, 'movie_id' | 'created_at' | 'updated_at'> = req.body;

  const { data, error } = await supabase
    .from('movies')
    .insert([movie])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
};

export const getMovieById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('movie_id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Movie not found' });
  return res.json(data);
};

export const updateMovie = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateData = req.body;

  const { data, error } = await supabase
    .from('movies')
    .update(updateData)
    .eq('movie_id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};

export const deleteMovie = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { error } = await supabase
    .from('movies')
    .update({ status: 2 })
    .eq('movie_id', id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted successfully' });
};

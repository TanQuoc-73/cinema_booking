'use client';

import React, { useState, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import { Pagination, TextField, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

const RED = '#d32f2f';

export default function MoviesPage() {
  const PAGE_SIZE = 12; // số phim mỗi trang
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(''); // state tìm kiếm theo tên/phim
  const [status, setStatus] = useState<number | null>(null); // state lọc trạng thái, null = tất cả

  // Lấy phim phân trang có tìm kiếm và lọc
  const { movies, total, loading, error } = useMovies(page, PAGE_SIZE, search, status);

  // Tính tổng số trang
  const pageCount = Math.ceil(total / PAGE_SIZE);

  // Đệm đủ cột để giữ layout vuông vức (nếu bạn muốn)
  const columns = 4;
  const remainder = movies.length % columns;
  const paddedMovies = remainder === 0 ? movies : [...movies, ...Array(columns - remainder).fill(null)];

  // Xử lý thay đổi trang khi bấm nút phân trang
  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Khi thay đổi search hoặc status reset trang về 1
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <div>
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-red-600 tracking-wide">Danh sách Phim</h2>

        {/* Phần tìm kiếm và lọc */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={4} justifyContent="flex-start">
          <TextField
            label="Tìm kiếm phim"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200, backgroundColor: '#1e1e1e', input: { color: 'white' }, '.MuiInputLabel-root': { color: RED } }}
            InputLabelProps={{ style: { color: RED } }}
          />
          <FormControl size="small" sx={{ minWidth: 150, backgroundColor: '#1e1e1e' }}>
            <InputLabel sx={{ color: RED }}>Trạng thái</InputLabel>
            <Select
              value={status ?? ''}
              label="Trạng thái"
              onChange={(e) => {
                const val = e.target.value;
                setStatus(String(val) === '' ? null : Number(val));
              }}
              sx={{ color: 'white', '.MuiSvgIcon-root': { color: RED }, '& .MuiSelect-icon': { color: RED } }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value={1}>Đang chiếu</MenuItem>
              <MenuItem value={0}>Sắp chiếu</MenuItem>
              <MenuItem value={2}>Ngừng chiếu</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <div className="w-full flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold mb-6">{error}</div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center text-gray-400 font-medium mb-6">Không có phim để hiển thị.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {paddedMovies.map((movie, idx) =>
            movie ? (
              <div
                key={movie.movie_id}
                className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer bg-neutral-900"
              >
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <h3 className="p-2 font-semibold text-center text-red-400 truncate">
                  {movie.title}
                </h3>
              </div>
            ) : (
              <div key={`empty-${idx}`} />
            )
          )}
        </div>

        {/* Nút phân trang */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: RED,
                  borderColor: RED,
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    bgcolor: RED,
                    color: 'white',
                    borderColor: RED,
                  },
                  '&:hover': {
                    bgcolor: 'rgba(211,47,47,0.08)',
                    borderColor: '#b71c1c',
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: RED,
                },
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}

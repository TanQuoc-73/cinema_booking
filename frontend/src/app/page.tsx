'use client';

import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import { useMovies } from '@/hooks/useMovies'; // Đảm bảo đúng path tới hook

export default function HomePage() {
  const PAGE_SIZE = 12; // số phim 1 trang

  // Quản lý state trang hiện tại
  const [page, setPage] = useState(1);

  // Lấy phim phân trang theo trang hiện tại
  const { movies, total, loading, error } = useMovies(page, PAGE_SIZE);

  // Tính tổng số trang
  const pageCount = Math.ceil(total / PAGE_SIZE);

  // Xử lý thay đổi trang khi nhấn nút phân trang
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Banner */}
      <section className="relative bg-red-900 h-[400px] flex items-center justify-center text-center px-5">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide">
            Chào mừng đến với Movie Booking App
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Đặt vé xem phim nhanh chóng & tiện lợi - tận hưởng trải nghiệm điện ảnh đỉnh cao
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="/movies"
              className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-lg text-white font-semibold transition"
            >
              Xem Phim
            </a>
            <a
              href="/bookings"
              className="border border-red-700 hover:border-red-800 px-6 py-3 rounded-lg text-red-700 hover:text-red-800 font-semibold transition"
            >
              Đặt Vé
            </a>
          </div>
        </div>
      </section>

      {/* Danh sách phim */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-red-600 tracking-wide">Danh sách Phim</h2>

        {loading && (
          <div className="w-full flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold mb-6">{error}</div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center text-gray-400 font-medium mb-6">Không có phim để hiển thị.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.movie_id}
              className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer bg-neutral-900"
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <h3 className="p-2 font-semibold text-center text-red-400 truncate">{movie.title}</h3>
            </div>
          ))}
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
                  color: '#d32f2f',
                  borderColor: '#d32f2f',
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    bgcolor: '#d32f2f',
                    color: 'white',
                    borderColor: '#d32f2f',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(211,47,47,0.08)',
                    borderColor: '#b71c1c',
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: '#d32f2f',
                },
              }}
            />
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="bg-gray-900 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-around gap-8 text-center">
          <a href="/movies" className="flex flex-col items-center gap-2 hover:text-red-600 transition">
            {/* SVG icon omitted for brevity */}
            <span className="font-semibold text-lg">Xem Phim</span>
          </a>
          <a href="/bookings" className="flex flex-col items-center gap-2 hover:text-red-600 transition">
            {/* SVG icon omitted for brevity */}
            <span className="font-semibold text-lg">Đặt Vé</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-2 hover:text-red-600 transition">
            {/* SVG icon omitted for brevity */}
            <span className="font-semibold text-lg">Hồ Sơ</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-500 text-center py-6 mt-12">
        © 2025 Movie Booking App. All rights reserved.
      </footer>
    </div>
  );
}

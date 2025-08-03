'use client'

import React, { useState, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import { useCinemas } from '@/hooks/useCinemas';
import { useShowtimes } from '@/hooks/useShowtimes';
import { useSeats } from '@/hooks/useSeats';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/contexts/AuthContext';

interface Movie {
  id: number;
  title: string;
  poster_url?: string;
  description?: string;
}

interface Cinema {
  id: number;
  name: string;
}

interface Showtime {
  id: number;
  start_time: string;
  theater_name: string;
  theater_id: number;
  price: number;
}

interface Seat {
  id: number;
  name: string;
  status: number;
  price: number;
}

export default function BookingWizard() {
  const [step, setStep] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const { movies, loading: loadingMovies } = useMovies(1, 100, '', 1) as { movies: Movie[]; loading: boolean };
  const { cinemas, loading: loadingCinemas } = useCinemas() as { cinemas: Cinema[]; loading: boolean };
  const { showtimes, loading: loadingShowtimes } = useShowtimes(selectedMovie, selectedCinema) as { showtimes: Showtime[]; loading: boolean };
  const theaterId = selectedShowtime?.theater_id || null;
  const { seats, loading: loadingSeats } = useSeats(theaterId) as { seats: Seat[]; loading: boolean };
  const { book, loading: booking, error, success } = useBooking();
  const { accessToken } = useAuth();

  useEffect(() => {
    setSelectedCinema(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setStep(1);
  }, [movies]);

  useEffect(() => {
    setSelectedShowtime(null);
    setSelectedSeats([]);
  }, [selectedCinema]);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedShowtime]);

  // Step 1: Chọn phim
  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Chọn phim đang chiếu</h2>
      {loadingMovies ? (
        <div>Đang tải phim...</div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {movies.length === 0 ? (
            <div key="no-movie">Không có phim đang chiếu.</div>
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                className={`w-44 rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200
                  ${selectedMovie === movie.id ? 'ring-4 ring-red-700 border-2 border-red-700' : 'shadow-black/20'}`}
                onClick={() => {
                  setSelectedMovie(movie.id);
                  setStep(2);
                }}
              >
                <img
                  src={movie.poster_url ?? 'https://via.placeholder.com/180x260?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-[260px] object-cover bg-gray-800"
                />
                <div className="p-3 bg-gray-900">
                  <div className="font-bold text-lg mb-1 truncate">{movie.title}</div>
                  <div className="text-gray-400 text-sm mb-3">
                    {movie.description
                      ? movie.description.length > 60
                        ? movie.description.slice(0, 60) + '...'
                        : movie.description
                      : 'Không có mô tả'}
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedMovie(movie.id);
                      setStep(2);
                    }}
                    className={`w-full py-2 rounded text-white font-semibold transition-colors duration-200
                      ${selectedMovie === movie.id ? 'bg-red-700' : 'bg-gray-700 hover:bg-red-700'}`}
                  >
                    {selectedMovie === movie.id ? 'Đã chọn' : 'Chọn phim'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  // Step 2: Chọn rạp
  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Chọn rạp</h2>
      {loadingCinemas ? (
        <div>Đang tải rạp...</div>
      ) : (
        <select
          value={selectedCinema ?? ''}
          onChange={e => setSelectedCinema(e.target.value ? Number(e.target.value) : null)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option value="">-- Chọn rạp --</option>
          {cinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
          ))}
        </select>
      )}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          Quay lại
        </button>
        <button
          type="button"
          disabled={!selectedCinema}
          onClick={() => setStep(3)}
          className={`px-4 py-2 rounded font-semibold transition 
            ${!selectedCinema ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600'}`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );

  // Step 3: Chọn suất chiếu
  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Chọn suất chiếu</h2>
      {loadingShowtimes ? (
        <div>Đang tải suất chiếu...</div>
      ) : (
        <select
          value={selectedShowtime?.id ?? ''}
          onChange={e => {
            const id = Number(e.target.value);
            const show = showtimes.find((s) => s.id === id) ?? null;
            setSelectedShowtime(show);
          }}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option value="">-- Chọn suất chiếu --</option>
          {showtimes.map((show) => (
            <option key={show.id} value={show.id}>
              {show.start_time} - {show.theater_name}
            </option>
          ))}
        </select>
      )}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          Quay lại
        </button>
        <button
          type="button"
          disabled={!selectedShowtime}
          onClick={() => setStep(4)}
          className={`px-4 py-2 rounded font-semibold transition 
            ${!selectedShowtime ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600'}`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );

  // Step 4: Chọn ghế
  const renderStep4 = () => {
    const toggleSeat = (seatId: number) => {
      setSelectedSeats(prev =>
        prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
      );
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Chọn ghế</h2>
        {loadingSeats ? (
          <div>Đang tải ghế...</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {seats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                disabled={seat.status !== 1}
                onClick={() => toggleSeat(seat.id)}
                aria-pressed={selectedSeats.includes(seat.id)}
                aria-label={`Ghế ${seat.name} ${seat.status !== 1 ? '(đã được đặt)' : ''}`}
                className={`px-3 py-2 rounded border text-center min-w-[48px] transition-colors
                  ${seat.status !== 1 ? 'bg-gray-700 cursor-not-allowed text-gray-400' : ''}
                  ${selectedSeats.includes(seat.id) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-black border-gray-400 hover:bg-gray-200'}`}
              >
                {seat.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Quay lại
          </button>
          <button
            type="button"
            disabled={selectedSeats.length === 0}
            onClick={() => setStep(5)}
            className={`px-4 py-2 rounded font-semibold transition 
              ${selectedSeats.length === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600'}`}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Xác nhận đặt vé
  const renderStep5 = () => {
    const movieTitle = movies.find(m => m.id === selectedMovie)?.title ?? '';
    const cinemaName = cinemas.find(c => c.id === selectedCinema)?.name ?? '';
    const seatNames = selectedSeats
      .map(id => seats.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    const totalPrice = selectedSeats.reduce((sum, id) => {
      const seat = seats.find(s => s.id === id);
      return sum + (seat?.price ?? selectedShowtime?.price ?? 0);
    }, 0);

    const handleBooking = async () => {
      if (!selectedShowtime) return;
      const seatPayload = selectedSeats.map(id => {
        const seat = seats.find(s => s.id === id);
        return {
          seat_id: id,
          price: seat?.price ?? selectedShowtime.price,
        };
      });

      await book({
        showtimeId: selectedShowtime.id,
        seats: seatPayload,
        totalPrice,
        accessToken,
      });
    };

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Xác nhận đặt vé</h2>
        <div className="mb-6 space-y-2 text-gray-300">
          <div><strong className="text-white">Phim:</strong> {movieTitle}</div>
          <div><strong className="text-white">Rạp:</strong> {cinemaName}</div>
          <div><strong className="text-white">Suất chiếu:</strong> {selectedShowtime?.start_time} - {selectedShowtime?.theater_name}</div>
          <div><strong className="text-white">Ghế:</strong> {seatNames}</div>
          <div><strong className="text-white">Tổng tiền:</strong> {totalPrice.toLocaleString()}đ</div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Quay lại
          </button>
          <button
            type="button"
            disabled={booking || !accessToken}
            onClick={handleBooking}
            className={`px-4 py-2 rounded font-semibold transition 
              ${booking || !accessToken ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600'}`}
          >
            Xác nhận đặt vé
          </button>
        </div>
        {booking && <div className="mt-4 text-yellow-400">Đang xử lý...</div>}
        {error && <div className="mt-4 text-red-500 whitespace-pre-line">Lỗi: {error}</div>}
        {success && <div className="mt-4 text-green-500">Đặt vé thành công!</div>}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Đặt vé xem phim</h1>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
}

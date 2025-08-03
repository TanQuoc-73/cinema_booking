import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import testRoutes from './routes/testRoutes';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import cinemaRoutes from "./routes/cinemaRoutes";
import theaterRoutes from "./routes/theaterRoutes";
import seatRoutes from "./routes/seatRoutes";
import showtimeRoutes from "./routes/showtimeRoutes";
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
import paymentRoutes from './routes/paymentRoutes';
import promotionRoutes from './routes/promotionRoutes';
import promotionUsageRoutes from './routes/promotionUsageRoutes';


// import bookingRoutes from './routes/bookingRoutes';

// import { supabase } from './config/supabaseClient';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Movie Booking App!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

// Routes
// app.use('/test', testRoutes);
app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/promotion-usages', promotionUsageRoutes);


// async function testConnection() {
//   const { data, error } = await supabase.from('movies').select('*').limit(1);
//   if (error) console.error('Supabase test query error:', error.message);
//   else console.log('Supabase connected successfully, test data:', data);
// }

// testConnection();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import adminAuctionRoutes from './routes/admin/auctionRoutes.js';
import adminUserRoutes from './routes/admin/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import frontendRoutes from './routes/frontendRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userAuctionRoutes from './routes/user/auctionRoutes.js';
import userBidRoutes from './routes/user/bidRoutes.js';


dotenv.config();
const app = express();


app.use(cors({
    origin: 'https://dev.bidbazaar.shop',
    credentials: true
  }));

app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());


try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}

// import './utils/worker/updateAuctionsStatus.js';

// Frontend
app.use('/', frontendRoutes);


// Payment
app.use('/api/payments', paymentRoutes);

// Backend
// Admin
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/auction', adminAuctionRoutes);

// User
app.use('/api/auctions', userAuctionRoutes);
app.use('/api/bids', userBidRoutes);


app.listen(process.env.PORT, () => {
    console.log(`listening on port http://localhost:${process.env.PORT}.....`);
    console.log("Live on https://dev.bidbazaar.shop");
});
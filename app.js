import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import frontendRoutes from './routes/frontendRoutes.js';


dotenv.config();
const app = express();

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

// Frontend
app.use('/', frontendRoutes);


// Backend
app.use('/api/auth', authRoutes);


app.listen(process.env.PORT, () => {
    console.log(`listening on port http://localhost:${process.env.PORT}.....`);
});
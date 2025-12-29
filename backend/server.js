import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


import { connectRedis } from "./config/redis.js";
import User from "./models/user.js";
import Category, { DEFAULT_CATEGORIES } from "./models/Category.js";
import Product from "./models/Product.js";
import Store from "./models/Store.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import Review from "./models/Review.js";


import authRoutes from './routes/authRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';

dotenv.config();
const app = express();


app.use(cors({
  origin: ['https://thnm.id.vn', 'https://it4409-81ee6.web.app'], 
  credentials: true
}));
app.use(express.json());


if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ Thiếu biến môi trường (MONGO_URI hoặc JWT_SECRET) trong file .env');
  process.exit(1);
}


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
})
  .then(() => console.log('✅ mongoose.connect() resolved'))
  .catch(err => console.error('❌ mongoose.connect() failed:', err));

mongoose.connection.on('connected', async () => {
  console.log('✅ MongoDB connected');
  try {
    
    const ensureDefaultCategories = async () => {
      try {
        const names = Array.isArray(DEFAULT_CATEGORIES) && DEFAULT_CATEGORIES.length 
          ? DEFAULT_CATEGORIES 
          : ['Laptop', 'Điện thoại', 'PC'];
          
        for (const name of names) {
          const existingCat = await Category.findOne({ name });
          if (!existingCat) {
            await Category.create({ name, description: `${name} category` });
            console.log('✅ Default category created:', name);
          }
        }
      } catch (e) {
        console.error('Error ensuring default categories:', e?.message || e);
      }
    };
    await ensureDefaultCategories();
  } catch (err) {
    console.error('Error after DB connect:', err);
  }
});

mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

//goi redis
connectRedis();

app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});


app.use('/api', authRoutes);
app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
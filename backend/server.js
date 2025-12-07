import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createClient } from "redis";

import User from "./models/user.js";
import bcrypt from "bcryptjs";
import Category, { DEFAULT_CATEGORIES } from "./models/Category.js";
import Product from "./models/Product.js";
import Store from "./models/Store.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import Review from "./models/Review.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set. Please set it in .env');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Please set it in .env');
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
        const names = Array.isArray(DEFAULT_CATEGORIES) && DEFAULT_CATEGORIES.length ? DEFAULT_CATEGORIES : ['Laptop', 'Điện thoại', 'PC'];
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
    console.error('Error creating default user after DB connect:', err);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
let redisClient;
if (process.env.REDIS_URL) {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.connect()
      .then(() => console.log('✅ Redis connected'))
      .catch((err) => console.warn('⚠️ Redis connection failed (continuing without Redis):', err.message || err));
  } catch (err) {
    console.warn('⚠️ Redis initialization failed (continuing without Redis):', err.message || err);
  }
} else {
  console.log('ℹ️ REDIS_URL not set — starting without Redis');
}

app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});

import authRoutes from './routes/authRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';

app.use('/api', authRoutes);
app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

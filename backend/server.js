import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().then(() => console.log("✅ Redis connected"));

// Example route
app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

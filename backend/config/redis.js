import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config(); //Nap bien tu env


const redisClient = createClient({ 
  url: process.env.REDIS_URL 
});

redisClient.on('error', (err) => console.warn('⚠️ Redis Error:', err));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log(' Redis connected from config');
    }
  } catch (err) {
    console.warn('Redis connection failed:', err.message);
  }
};


export { redisClient, connectRedis };
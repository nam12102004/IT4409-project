import axios from "axios";

// 🔴 FIX CỨNG URL BACKEND (TRÁNH VITE BỊ NHẦM)
const REVIEW_API = "http://localhost:5000/api/reviews";

export const getReviews = (productId) => {
  return axios.get(`${REVIEW_API}/product/${productId}`);
};

export const createReview = (productId, data) => {
  return axios.post(`${REVIEW_API}/product/${productId}`, data);
};

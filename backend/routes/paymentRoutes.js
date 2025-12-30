import express from "express";
import { zaloPayCallback, getZaloPayStatus } from "../controllers/paymentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// ZaloPay callback URL (configure this URL in ZaloPay dashboard)
router.post("/zalopay/callback", zaloPayCallback);

// Truy vấn trạng thái thanh toán ZaloPay theo orderId (cần đăng nhập)
router.get("/zalopay/status/:orderId", authenticateToken, getZaloPayStatus);

export default router;

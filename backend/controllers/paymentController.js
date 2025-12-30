import CryptoJS from "crypto-js";
import Order, { EOrderStatus } from "../models/Order.js";
import { zaloPayConfig, queryZaloPayStatus } from "../config/zalopay.js";

export const zaloPayCallback = async (req, res) => {
  const result = {};

  try {
    const dataStr = req.body?.data;
    const reqMac = req.body?.mac;

    if (!dataStr || !reqMac) {
      result.return_code = -1;
      result.return_message = "missing data or mac";
      return res.json(result);
    }

    const mac = CryptoJS.HmacSHA256(dataStr, zaloPayConfig.key2).toString();
    console.log("[ZaloPay] computed mac =", mac);

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      const dataJson = JSON.parse(dataStr);
      const appTransId = dataJson["app_trans_id"];

      if (appTransId) {
        await Order.findOneAndUpdate(
          { zaloPayAppTransId: appTransId },
          { $set: { orderStatus: EOrderStatus.Shipping } }
        );
        console.log(
          "[ZaloPay] Updated order status to confirmed for app_trans_id =",
          appTransId
        );
      } else {
        console.warn("[ZaloPay] app_trans_id missing in callback data");
      }

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.error("[ZaloPay] callback error:", ex);
    result.return_code = 0; // ZaloPay sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  return res.json(result);
};

// API cho phép client truy vấn trạng thái thanh toán ZaloPay theo orderId
// Server sẽ lấy app_trans_id lưu trong đơn (zaloPayAppTransId) và gọi ZaloPay
export const getZaloPayStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    let order = await Order.findById(orderId).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.zaloPayAppTransId) {
      return res.status(400).json({ message: "Order does not have a ZaloPay transaction" });
    }

    const statusData = await queryZaloPayStatus(order.zaloPayAppTransId);
    console.log("[ZaloPay] query status response:", statusData);

    // Nếu ZaloPay trả về trạng thái thành công, tự động cập nhật đơn từ waiting_for_payment -> confirmed
    try {
      // Theo tài liệu getstatusbyapptransid:
      // - returncode (int) = 1  => giao dịch thành công
      // - returncode != 1       => chưa thanh toán / thất bại / quá hạn
      const returnCode = Number(statusData?.returncode);
      const isSuccess = returnCode === 1;

      if (isSuccess && order.orderStatus === EOrderStatus.WaitingForPayment) {
        const updated = await Order.findByIdAndUpdate(
          orderId,
          { $set: { orderStatus: EOrderStatus.Shipping } },
          { new: true }
        ).lean();
        if (updated) {
          order = updated;
        }
      }
    } catch (updateErr) {
      console.error("Failed to auto update order status after ZaloPay query:", updateErr);
    }

    return res.json({
      appTransId: order.zaloPayAppTransId,
      zaloPayStatus: statusData,
      order,
    });
  } catch (err) {
    console.error("getZaloPayStatus error:", err);
    return res.status(500).json({ message: "Failed to query ZaloPay status" });
  }
};

export default { zaloPayCallback, getZaloPayStatus };

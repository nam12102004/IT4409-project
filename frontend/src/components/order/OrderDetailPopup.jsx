import React from "react";
import axios from "axios";

export default function OrderDetailPopup({ order, onClose, onUpdateStatus }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleCancelOrder = async () => {
    try {
      if (!token) return;
      const res = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateStatus?.(order._id, res.data.order.orderStatus);
      onClose();
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
    }
  };

  const handleReceiveOrder = async () => {
    try {
      if (!token) return;
      const res = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/receive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateStatus?.(order._id, res.data.order.orderStatus);
      onClose();
    } catch (err) {
      console.error("Lỗi khi xác nhận nhận hàng:", err);
    }
  };

  const handleReturnOrder = async () => {
    try {
      if (!token) return;
      const res = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateStatus?.(order._id, res.data.order.orderStatus);
      onClose();
    } catch (err) {
      console.error("Lỗi khi trả hàng/hoàn đơn:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
          Chi tiết đơn hàng #{order._id}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Khách hàng:</strong> {order.customerName}</p>
          <p><strong>SĐT:</strong> {order.customerPhone}</p>
          <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}₫</p>
          <p><strong>Trạng thái:</strong> {order.orderStatus}</p>
        </div>

        <h3 className="mt-4 font-semibold text-cyan-600">Sản phẩm:</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {order.items.map((item, index) => (
            <li key={index}>
              <img src={item.productImage} alt={item.productName} className="w-12 h-12 inline-block mr-2" />
              {item.productName} - SL: {item.quantity} - Giá: {(item.price || 0).toLocaleString()}₫
            </li>

          ))}
        </ul>

        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <button
            onClick={onClose}
            className="bg-cyan-500 text-white px-6 py-3 rounded-full font-bold hover:bg-cyan-600 transition"
          >
            Đóng
          </button>
          {order.orderStatus === "shipping" && (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleReceiveOrder}
                className="bg-emerald-500 text-white px-4 py-3 rounded-full font-bold hover:bg-emerald-600 transition text-sm"
              >
                Đã nhận hàng
              </button>
              <button
                onClick={handleReturnOrder}
                className="bg-orange-500 text-white px-4 py-3 rounded-full font-bold hover:bg-orange-600 transition text-sm"
              >
                Trả hàng
              </button>
            </div>
          )}
          {order.orderStatus !== "cancelled" &&
            order.orderStatus !== "shipping" &&
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "refunded" && (
              <button
                onClick={handleCancelOrder}
                className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition ml-auto"
              >
                Hủy đơn
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
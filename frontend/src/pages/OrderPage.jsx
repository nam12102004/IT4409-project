import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailPopup from "../components/order/OrderDetailPopup";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serverOrders = Array.isArray(res.data.orders)
        ? res.data.orders
        : [];

      setOrders(serverOrders);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      setOrders([]); // fallback để tránh lỗi map
    }
  };
  fetchOrders();
}, []);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-cyan-100 text-cyan-800">
              <th className="border p-3">Mã đơn</th>
              <th className="border p-3">Khách hàng</th>
              <th className="border p-3">SĐT</th>
              <th className="border p-3">Tổng tiền</th>
              <th className="border p-3">Trạng thái</th>
              <th className="border p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border p-3">{order._id}</td>
                <td className="border p-3">{order.customerName}</td>
                <td className="border p-3">{order.customerPhone}</td>
                <td className="border p-3 font-semibold text-red-600">
                  {order.totalPrice.toLocaleString()}₫
                </td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.orderStatus === "confirmed" ? "bg-green-100 text-green-700" :
                    order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" : ""
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <OrderDetailPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={(id) => {
            setOrders((prev) =>
              prev.map((o) =>
                o._id === id ? { ...o, orderStatus: "cancelled" } : o
              )
            );
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
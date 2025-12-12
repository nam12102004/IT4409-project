import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import OrderDetailPopup from "../components/order/OrderDetailPopup";

export default function OrderPage() {
  const { orders } = useCart();
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            <th className="border p-3">Hành động</th>
            </tr>
        </thead>
        <tbody>
            {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
                <td className="border p-3">{order.id}</td>
                <td className="border p-3">{order.customer}</td>
                <td className="border p-3">{order.phone}</td>
                <td className="border p-3 font-semibold text-red-600">
                {order.total.toLocaleString()}₫
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
        <OrderDetailPopup order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
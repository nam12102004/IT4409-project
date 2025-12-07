import React from "react";

export default function OrderDetailPopup({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
          Chi tiết đơn hàng #{order.id}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Khách hàng:</strong> {order.customer}</p>
          <p><strong>SĐT:</strong> {order.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
          <p><strong>Tổng tiền:</strong> {order.total.toLocaleString()}₫</p>
        </div>

        <h3 className="mt-4 font-semibold text-cyan-600">Sản phẩm:</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.name} - SL: {item.quantity} - Giá: {item.newPrice.toLocaleString()}₫
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-cyan-500 text-white px-6 py-3 rounded-full font-bold hover:bg-cyan-600 transition"
          >
            Đóng chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
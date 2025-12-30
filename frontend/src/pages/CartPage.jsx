import React from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Tạo dữ liệu đơn hàng mới
    const newOrder = {
      id: Date.now(), // id đơn hàng tạm thời
      items: cart,
      total: totalPrice,
      status: "Đang xử lý", // trạng thái ban đầu
      date: new Date().toLocaleDateString(),
    };

    // Lưu vào localStorage (hoặc gọi API backend nếu có)
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...savedOrders, newOrder]));

    // Sau khi lưu, điều hướng sang trang danh sách đơn hàng
    navigate("/orders");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Giá: {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Ô nhập số lượng */}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />

                  {/* Nút xóa */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold mt-4">
            Tổng cộng: {formatPrice(totalPrice)}

          </h2>

          {/* Nút Thanh toán */}
          <button
            onClick={handleCheckout}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thanh toán
          </button>
        </>
      )}
    </div>
  );
}
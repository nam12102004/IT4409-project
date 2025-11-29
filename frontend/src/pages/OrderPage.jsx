import { Link } from "react-router-dom";

export default function OrderPage() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  return (
    <div>
      <h2>📦 Đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Đơn #{order.id} - Ngày: {order.date}</p>
              <p>Trạng thái: {order.status}</p>
              <Link to={`/orders/${order.id}`}>Xem chi tiết</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
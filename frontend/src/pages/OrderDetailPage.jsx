import { useParams } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const order = orders.find((o) => o.id.toString() === orderId);

  if (!order) {
    return <p>Không tìm thấy đơn hàng.</p>;
  }

  return (
    <div>
      <h2>Chi tiết đơn hàng #{order.id}</h2>
      <p>Ngày đặt: {order.date}</p>
      <p>Trạng thái: {order.status}</p>
      <h3>Sản phẩm:</h3>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} - SL: {item.quantity} - Giá: {formatPrice(item.price * item.quantity)}

          </li>
        ))}
      </ul>
      <p>Tổng cộng: {formatPrice(order.total)}</p>
    </div>
  );
}
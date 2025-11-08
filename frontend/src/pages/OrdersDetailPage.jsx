import { useParams } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Typography, List, ListItem } from '@mui/material';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>;

  return (
    <div>
      <Typography variant="h5">Chi tiết đơn hàng: {order.id}</Typography>
      <Typography>Ngày đặt: {order.date}</Typography>
      <Typography>Trạng thái: {order.status}</Typography>
      <List>
        {order.items.map((item, index) => (
          <ListItem key={index}>
            {item.name} × {item.quantity} – {item.price.toLocaleString()}₫
          </ListItem>
        ))}
      </List>
    </div>
  );
}
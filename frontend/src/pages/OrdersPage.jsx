import { useOrders } from '../hooks/useOrders';
import { Typography, List, ListItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4" gutterBottom>Danh sách đơn hàng</Typography>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              Mã đơn: {order.id} – Ngày: {order.date} – Trạng thái: {order.status}
            </span>
            <Button onClick={() => navigate(`/orders/${order.id}`)}>Xem chi tiết</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
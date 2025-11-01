import { useCart } from '../hooks/useCart';
import { Typography, List, ListItem, Button } from '@mui/material';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div>
      <Typography variant="h4" gutterBottom>Giỏ hàng của bạn</Typography>
      <List>
        {cart.map((item) => (
          <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name} – {item.price.toLocaleString()}₫ × {item.quantity}</span>
            <div>
              <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
              <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</Button>
              <Button onClick={() => removeFromCart(item.id)}>Xóa</Button>
            </div>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Tổng tiền: {totalPrice.toLocaleString()}₫
      </Typography>
    </div>
  );
}
import { useProducts } from '../hooks/useProducts';
import { Typography, CircularProgress, Alert, List, ListItem, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function ProductList() {
  const { data, isLoading, error } = useProducts();
  const { addToCart } = useCart();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Lỗi khi tải dữ liệu</Alert>;

  const filtered = category
    ? data.filter((item) => item.category === category)
    : data;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Sản phẩm: {category || 'Tất cả'}
      </Typography>
      <List>
        {filtered.map((item) => (
          <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name} – {item.price.toLocaleString()}₫</span>
            <Button variant="contained" onClick={() => addToCart(item)}>
              Thêm vào giỏ
            </Button>
          </ListItem>
        ))}
      </List>

    </div>
  );
}

export default ProductList;
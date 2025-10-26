import { useProducts } from '../hooks/useProducts';
import { Typography, CircularProgress, Alert, List, ListItem } from '@mui/material';
import { useLocation } from 'react-router-dom';

function ProductList() {
  const { data, isLoading, error } = useProducts();
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
          <ListItem key={item.id}>
            {item.name} – {item.price.toLocaleString()}₫
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ProductList;
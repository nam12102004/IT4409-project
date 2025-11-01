import { Typography, FormControl, InputLabel, Select, MenuItem,Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Grid } from '@mui/material';

function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    navigate(`/products?category=${value}`);
  };

  return (
  <Grid container spacing={4}>
    <Grid item xs={8}>
      <Typography variant="h4" gutterBottom>
        Trang chủ React + MUI
      </Typography>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel>Chọn loại hàng</InputLabel>
        <Select value={selected} label="Chọn loại hàng" onChange={handleChange}>
          <MenuItem value="Laptop">Laptop</MenuItem>
          <MenuItem value="Phone">Phone</MenuItem>
          <MenuItem value="Tablet">Tablet</MenuItem>
        </Select>
      </FormControl>

      {/* sau này có thể dùng App Navbar để chứa nút này */}
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate('/cart')}
      >
        🛒 Xem giỏ hàng
      </Button>
    </Grid>

    <Grid item xs={4}>
    </Grid>
  </Grid>
);

}

export default Home;
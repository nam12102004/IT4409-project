import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AppNavbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#fff',
          }}
        >
          <img
            src="/logo192.png"
            alt="Logo"
            style={{ width: 32, height: 32, marginRight: 8 }}
          />
          <Typography variant="h6" component="span" sx={{ color: '#fff' }}>
            Shop
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
            onClick={() => navigate('/cart')}
            sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                color: '#fff',
            }}
        >
            <Typography variant="h6" component="span" sx={{ color: '#fff' }}>
              Giỏ hàng
            </Typography>
        </Box>
        <Box
            onClick={() => navigate('/orders')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              color: '#fff',
            }}
          >
            <Typography variant="h6" component="span" sx={{ color: '#fff' }}>
              Đơn hàng
            </Typography>
        </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
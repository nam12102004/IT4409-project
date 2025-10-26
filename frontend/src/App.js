import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './pages/Home';
import ProductList from './pages/ProductList';

function App() {
  return (
    <BrowserRouter>
      <Container sx={{ mt: 5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
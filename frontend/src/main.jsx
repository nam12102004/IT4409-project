import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './index.css'

import App from './App.jsx'
import AdminPortal from './AdminPortal.jsx'
import { CartProvider } from './contexts/CartContext.jsx';
//import { ProductProvider } from './contexts/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
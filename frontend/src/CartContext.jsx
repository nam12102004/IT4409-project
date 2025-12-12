import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  
  const [cartItems, setCartItems] = useState([]); 
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  //state de mo/dong form thanh toan
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  //them san pham vao gio
  const addToCart = (product) => {
    setCartItems(prevItems => {
      
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // tang so luong neu da co
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || cartItems.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin và có sản phẩm trong giỏ.');
      return;
    }
    console.log("--- ĐƠN HÀNG ĐÃ ĐẶT ---", formData, cartItems);
    setOrderSuccess(true);
    setCartItems([]); 
    
    //dong form sau 5s
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setOrderSuccess(false); 
    }, 5000);
  };

  
  const value = {
    cartItems,
    addToCart,
    formData,
    setFormData,
    orderSuccess,
    handlePlaceOrder,
    isCheckoutOpen,
    setIsCheckoutOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
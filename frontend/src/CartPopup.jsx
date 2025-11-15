import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext.jsx'; 

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}


export function CartPopup({ onClose }) {
  const { cartItems, setIsCheckoutOpen } = useCart();
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.newPrice * item.quantity), 0);

  const handleCheckout = () => {
    setIsCheckoutOpen(true); //mo form
    onClose(); //dong popup
  };

  return (
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-40"
      onClick={onClose}
    >
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()} 
        className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Giỏ hàng của bạn</h2>
        </div>
        
        
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-3">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded border" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                  <p className="text-sm font-semibold text-red-600">{formatPrice(item.newPrice)}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        
        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-4">
            <div className="flex justify-between font-semibold">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
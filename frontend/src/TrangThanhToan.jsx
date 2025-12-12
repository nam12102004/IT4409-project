import React from 'react';
import { useCart } from './CartContext.jsx';
import { CheckoutForm } from './DonCheckOut.jsx'; 
import { OrderSummary } from './TongKetDonHang.jsx'; 
import { motion } from 'framer-motion';

export function TrangThanhToan() { 
  const { 
    cartItems, 
    formData, 
    setFormData, 
    orderSuccess, 
    handlePlaceOrder,
    setIsCheckoutOpen
  } = useCart();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-5"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-50 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold text-center">Thanh toán đơn hàng</h2>
        </div>
        
        <div className="p-5 overflow-y-auto">
          {orderSuccess ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
              <h3 className="font-bold text-xl">Đặt hàng thành công!</h3>
              <p>Cảm ơn bạn đã mua hàng. (Sẽ tự đóng sau 5s)</p>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <CheckoutForm formData={formData} setFormData={setFormData} />
                <div className="flex flex-col gap-6">
                  <OrderSummary cartItems={cartItems} />
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white font-bold text-lg py-3 rounded-lg shadow-md hover:bg-red-700"
                  >
                    Xác nhận Đặt Hàng
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
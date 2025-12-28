import React from "react";
import { useCart } from "../../hooks/useCart";
import { CheckoutForm } from "./CheckOutForm.jsx";
import { OrderSummary } from "./OrderSummary.jsx";
import { motion } from "framer-motion";

export function TrangThanhToan() {
  const {
    cartItems,
    formData,
    setFormData,
    orderSuccess,
    handlePlaceOrder,
    paymentMethod,
    setPaymentMethod,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCheckoutOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <motion.div
      className="checkout-modal"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <div className="checkout-container flex gap-6">
        <CheckoutForm
          formData={formData}
          setFormData={setFormData}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onPlaceOrder={handlePlaceOrder}
        />
        <OrderSummary items={cartItems} orderSuccess={orderSuccess} />
      </div>
    </motion.div>
  );
}

export default TrangThanhToan;

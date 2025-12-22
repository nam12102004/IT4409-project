import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // state mở/đóng popup giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);

  // state mở/đóng form thanh toán
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // danh sách đơn hàng đã đặt
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem("orders");
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  }, [orders]);

  // thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // tăng số lượng nếu đã có
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // giảm số lượng hoặc xóa nếu quantity = 1
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // xử lý đặt hàng
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      cartItems.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và có sản phẩm trong giỏ.");
      return;
    }
    console.log("--- ĐƠN HÀNG ĐÃ ĐẶT ---", formData, cartItems);
    setOrderSuccess(true);
    setCartItems([]);
    const newOrder = {
      id: Date.now(), // mã đơn hàng tạm thời
      customer: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: cartItems,
      total: cartItems.reduce(
        (acc, item) => acc + item.newPrice * item.quantity,
        0
      ),
    };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    // đóng form sau 5s
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setOrderSuccess(false);
    }, 5000);
  };

  const value = {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    formData,
    setFormData,
    orderSuccess,
    handlePlaceOrder,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    orders,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

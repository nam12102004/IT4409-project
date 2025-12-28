import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // state mở/đóng popup giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);

  // state mở/đóng form thanh toán
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // danh sách đơn hàng đã đặt (lấy từ backend)
  const [orders, setOrders] = useState([]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // load orders từ backend khi đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverOrders = Array.isArray(res?.data?.orders)
          ? res.data.orders
          : [];

        const mappedOrders = serverOrders.map((o) => ({
          id: o._id,
          customer: o.customerName,
          phone: o.customerPhone,
          address: o.shippingAddress,
          total: o.totalPrice,
          items:
            Array.isArray(o.items)
              ? o.items.map((it, idx) => ({
                  id: it.productId || idx,
                  name: it.productName,
                  quantity: it.quantity,
                  newPrice: it.price,
                }))
              : [],
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders from backend:", error);
      }
    };

    fetchOrders();
  }, []);

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
  const handlePlaceOrder = async (e) => {
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng.");
      return;
    }

    try {
      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          productName: item.name,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          newPrice: item.newPrice,
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdOrder = res?.data?.order;
      const paymentData = res?.data?.paymentData;

      // Nếu chọn ZaloPay: chuyển sang trang thanh toán ZaloPay
      if (paymentMethod === "zalopay") {
        const redirectUrl =
          paymentData?.order_url ||
          paymentData?.orderurl ||
          paymentData?.orderUrl;

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        alert("Không tìm thấy link thanh toán ZaloPay.");
        return;
      }
      const newOrder = createdOrder
        ? {
            id: createdOrder._id,
            customer: createdOrder.customerName,
            phone: createdOrder.customerPhone,
            address: createdOrder.shippingAddress,
            items:
              Array.isArray(createdOrder.items)
                ? createdOrder.items.map((it, idx) => ({
                    id: it.productId || idx,
                    name: it.productName,
                    quantity: it.quantity,
                    newPrice: it.price,
                  }))
                : cartItems,
            total: createdOrder.totalPrice,
          }
        : {
            id: Date.now(),
            customer: formData.name,
            phone: formData.phone,
            address: formData.address,
            items: cartItems,
            total: cartItems.reduce(
              (acc, item) => acc + item.newPrice * item.quantity,
              0
            ),
          };

      setOrderSuccess(true);
      setCartItems([]);
      setOrders((prevOrders) => [newOrder, ...prevOrders]);

      // đóng form sau 5s
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setOrderSuccess(false);
      }, 5000);
    } catch (err) {
      alert(err?.response?.data?.message || "Đặt hàng thất bại");
    }
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
    paymentMethod,
    setPaymentMethod,
    orders,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

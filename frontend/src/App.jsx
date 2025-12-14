import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/common/Header/Header";
import Footer from "./components/home/WelcomeBanner/Footer";

import WelcomeBanner from "./components/home/WelcomeBanner/WelcomeBanner";
import CategoryList from "./components/home/CategoryList/CategoryList";

import TestProductCard from "./pages/TestProductCard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListingPage from "./pages/ProductListingPage/ProductListingPage";
import OrderPage from "./pages/OrderPage";
import { CartPopup } from "./components/cart/CartPopup";
import { TrangThanhToan } from "./components/cart/TrangThanhToan";
import { ProductDetailPage } from "./pages/ProductDetail";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("laptop");

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <WelcomeBanner />
              <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </>
          }
        />

        <Route path="/test-card" element={<TestProductCard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:category" element={<ProductListingPage />} />

        <Route path="/product/:id" element={<ProductDetailPage />} />

        <Route path="/orders" element={<OrderPage />} />
      </Routes>

      <Footer />
      <CartPopup />
      <TrangThanhToan />
    </div>
  );
}

export default App;

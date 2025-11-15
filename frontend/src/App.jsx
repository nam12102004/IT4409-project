import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/common/Header";
import WelcomeBanner from "./components/home/WelcomeBanner";
import CategoryList from "./components/home/CategoryList";
import TestProductCard from "./pages/TestProductCard";
import ProductListingPage from "./pages/ProductListingPage";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("laptop");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
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
          {/* ← Thêm route test */}
          <Route path="/test-card" element={<TestProductCard />} />
          {/* Route Product Listing Page */}
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:category" element={<ProductListingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

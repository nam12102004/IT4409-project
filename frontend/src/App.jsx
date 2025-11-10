import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/common/Header.jsx";
import WelcomeBanner from "./components/home/WelcomeBanner.jsx";
import CategoryList from "./components/home/CategoryList.jsx";
import TestProductCard from "./pages/TestProductCard";

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

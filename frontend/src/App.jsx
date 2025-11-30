import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";


import Header from "./components/common/Header/Header"; 


import WelcomeBanner from "./components/home/WelcomeBanner/WelcomeBanner";
import CategoryList from "./components/home/CategoryList/CategoryList";


import TestProductCard from "./pages/TestProductCard";
import ProductListingPage from "./pages/ProductListingPage/ProductListingPage"; 
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";

function App() {
  
  const [selectedCategory, setSelectedCategory] = useState("laptop");

  return (
    //code co chinh lai router de dong nhat voi team
      <div className="min-h-screen bg-gray-50 font-sans relative">
        
      
        <Link 
          to="/admin"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 hover:scale-110 transition-all flex items-center gap-2 group cursor-pointer border-2 border-white"
          title="Vào trang Admin"
        >
          <ShieldCheck size={24} />
        </Link>

        
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
          
          
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:category" element={<ProductListingPage />} />
          
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          
         
        </Routes>
      </div>
    
  );
}

export default App;
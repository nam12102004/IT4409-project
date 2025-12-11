import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import Header from "./components/common/Header/Header";  
import Footer from './components/home/WelcomeBanner/Footer';

import WelcomeBanner from "./components/home/WelcomeBanner/WelcomeBanner";
import CategoryList from "./components/home/CategoryList/CategoryList";


import TestProductCard from "./pages/TestProductCard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListingPage from "./pages/ProductListingPage/ProductListingPage"; 
import OrderPage from "./pages/OrderPage";
import { CartPopup } from "./components/cart/CartPopup";
import { TrangThanhToan } from "./components/cart/TrangThanhToan";
//import AdminProductPage from "./pages/admin/AdminProductPage.jsx";
//import Dashboard from "./pages/admin/DashBoard.jsx";


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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:category" element={<ProductListingPage />} />
          
          <Route path="/orders" element={<OrderPage />} />
          {/* Admin routes */}
          {/*<Route path="/admin/products" element={<AdminProductPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />*/}

        </Routes> 

        <Footer />
        <CartPopup />
        <TrangThanhToan />
      </div>
    
  );
}

export default App;
import React, { useState } from 'react';
import { FiMenu, FiSearch, FiMapPin, FiUser, FiShoppingCart } from 'react-icons/fi';
import { useCart } from './CartContext.jsx'; 
import { AnimatePresence } from 'framer-motion'; 
import { CartPopup } from './CartPopup.jsx'; 

function Header() {
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const { cartItems } = useCart(); //lay thong tin hang tu kho

  //tinh tong so luong
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    
    <> 
      <header className="bg-sky-100 px-8 py-4 flex justify-between items-center border-b border-sky-200 font-sans z-10 relative">
        
        <div className="flex items-center gap-5">
          <div className="text-3xl font-bold text-blue-500 relative pr-2.5">
            Tech-Geeks
            <span className="w-1 h-6 bg-orange-500 rounded absolute right-0 top-1/2 -translate-y-1/2"></span>
          </div>
          <a href="#" className="flex items-center gap-2 text-gray-800 font-medium text-sm bg-white px-3 py-2 rounded-lg shadow-sm hover:text-blue-500">
            <FiMenu />
            <span>Sản phẩm</span>
          </a>
        </div>

        
        <div className="flex-grow mx-8 max-w-xl relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            type="text" 
            placeholder="Xin chào, bạn đang tìm gì?" 
            className="w-full pl-12 pr-5 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        
        <div className="flex items-center gap-5">
          <a href="#" className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-blue-500">
            <FiMapPin />
            <span>Địa chỉ cửa hàng</span>
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-blue-500">
            <FiUser />
            <span>Đăng nhập</span>
          </a>

          {/* nut gio hang sau update */}
          <button 
            onClick={() => setIsPopupOpen(true)} 
            className="flex items-center gap-2 bg-cyan-400 text-white rounded-full px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-cyan-500 relative"
          >
            <FiShoppingCart />
            <span>0 ₫</span>
            
            
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      
      
      <AnimatePresence>
        {isPopupOpen && <CartPopup onClose={() => setIsPopupOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default Header;
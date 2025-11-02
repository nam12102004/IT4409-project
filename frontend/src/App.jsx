import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Import component của bạn
import Header from './header.jsx'; 
import WelcomeBanner from './WelcomeBanner.jsx'; 
import { CategoryList } from './IconDanhMuc.jsx';
import { ProductGrid } from './ProductGrid.jsx';
import { ProductModal } from './ProductModal.jsx'; // Tái sử dụng demo trước!

function App() {
  // State cho danh mục đang được chọn
  const [selectedCategory, setSelectedCategory] = useState('laptop'); // Mặc định là laptop
  
  // State cho sản phẩm đang được chọn (để mở modal)
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="App bg-gray-50 min-h-screen">
      <Header />
      <WelcomeBanner />

      {/* Component danh mục */}
      <CategoryList 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Component lưới sản phẩm */}
      <ProductGrid 
        category={selectedCategory}
        onCardClick={setSelectedProduct}
      />

      {/* Phần "Magic Motion" Modal
        Tái sử dụng code từ demo trước của chúng ta!
      */}
      <AnimatePresence>
        {selectedProduct && (
          // Sửa lại ProductModal một chút để nó nhận `product`
          // thay vì `id` và hiển thị thông tin thật
          <ProductModal 
            key={selectedProduct.id} // Thêm key để nó hoạt động đúng
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
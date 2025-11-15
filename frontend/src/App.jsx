import React, { useState } from 'react'; 
import { AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext.jsx'; 

import Header from './header.jsx'; 
import WelcomeBanner from './WelcomeBanner.jsx'; 
 
import { CategoryList } from './IconDanhMuc.jsx'; 
import { ProductGrid } from './ProductGrid.jsx';
import { ProductModal } from './ProductModal.jsx';
import { TrangThanhToan } from './TrangThanhToan.jsx'; 

function App() {
  
  const { isCheckoutOpen } = useCart(); 
  
  
  const [selectedCategory, setSelectedCategory] = useState('laptop');
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="App bg-gray-50 min-h-screen">
      <Header />
      <WelcomeBanner />
      
      
      <CategoryList 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProductGrid 
        category={selectedCategory}
        onCardClick={setSelectedProduct}
      />
      
      
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            key={selectedProduct.id}
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {isCheckoutOpen && <TrangThanhToan />}
      </AnimatePresence>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';


import Header from './header.jsx'; 
import WelcomeBanner from './WelcomeBanner.jsx'; 
import { CategoryList } from './IconDanhMuc.jsx';
import { ProductGrid } from './ProductGrid.jsx';
import { ProductModal } from './ProductModal.jsx'; 

function App() {
  
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
    </div>
  );
}

export default App;
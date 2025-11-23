import React, { useState } from 'react'; 
import { AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import { ShieldCheck } from 'lucide-react';


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

  //hook chuyen sang trang admin
  const navigate = useNavigate();

  return (
    <div className="App bg-gray-50 min-h-screen relative font-sans">
      
      
      <button 
        onClick={() => navigate('/admin')}
        className="fixed bottom-5 right-5 z-40 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 hover:scale-110 transition-all flex items-center gap-2 group cursor-pointer border-2 border-white"
        title="Vào trang Admin"
      >
        <ShieldCheck size={24} />
      </button>

      
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
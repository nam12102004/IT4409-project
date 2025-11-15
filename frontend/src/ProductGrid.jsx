import React from 'react';
import { motion } from 'framer-motion';
import { products } from './Danhmucsanpham.jsx';
import { ProductCard } from './ProductCard.jsx';


export function ProductGrid({ category, onCardClick }) {
  
  const filteredProducts = products.filter(p => p.categoryId === category);

  return (
    <div className="px-5 py-8">
      <h2 className="text-2xl font-semibold mb-6">Sản phẩm nổi bật</h2>
      
    <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={onCardClick} 
          />
        ))}
      </motion.div>
    </div>
  );
}
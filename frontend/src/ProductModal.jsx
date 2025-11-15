import { motion } from 'framer-motion';
import { useCart } from './CartContext.jsx'; //hook


function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}


export function ProductModal({ product, onClose }) {
  
  // Lay ham tu CartContext
  const { addToCart, setIsCheckoutOpen } = useCart();

  
  const handleOrderNow = () => {
    addToCart(product);      
    setIsCheckoutOpen(true); 
    onClose();               
  };

  return (
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-10"
    >
      
      <motion.div
        
        layoutId={`card-container-${product.id}`} 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8"
      >
       
        <div className="w-full md:w-1/2">
          <img src={product.imageUrl} alt={product.name} className="w-full object-contain rounded-lg" />
        </div>
        
        
        <div className="w-full md:w-1/2 flex flex-col">
          <motion.h2 
           
            layoutId={`card-title-${product.id}`} 
            className="text-3xl font-bold text-gray-800"
          >
            {product.name} 
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-gray-600 mt-4 text-sm"
          >
            {product.specs} 
          </motion.p>
          
          
          <div className="mt-6">
            <span className="text-3xl font-bold text-red-600">{formatPrice(product.newPrice)}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-md">
                {product.discount}
              </span>
            </div>
          </div>
          
         
          <div className="flex items-center gap-4 mt-auto ml-auto pt-6">
            <motion.button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold"
            >
              Đóng
            </motion.button>
            <motion.button
              onClick={handleOrderNow}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Đặt hàng ngay
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
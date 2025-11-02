import { motion } from 'framer-motion';
import { FaCheckCircle, FaGift } from 'react-icons/fa'; // Cần icon


function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}


export function ProductCard({ product, onClick }) {
  return (
    <motion.div
      layoutId={`card-container-${product.id}`} 
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer flex flex-col h-full"
      
      whileHover={{ y: -8, shadow: "rgba(0, 0, 0, 0.2) 0px 15px 25px" }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      
      <div className="relative p-4 h-52 flex justify-center items-center">
        <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain" />
        
        <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
          <FaCheckCircle />
          <span>HÀNG CHÍNH HÃNG</span>
        </div>
      </div>

      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 h-10 mb-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 h-8 mb-3">{product.specs}</p>
        </div>
        
        
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-red-600">{formatPrice(product.newPrice)}</span>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-md">
              {product.discount}
            </span>
          </div>
          <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
          
          
          <div className="bg-rose-50 text-red-700 text-xs p-2 rounded-md mt-3 flex items-center gap-1.5">
            <FaGift />
            <span>{product.gift}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Trả góp 0%</p>
        </div>
      </div>
    </motion.div>
  );
}
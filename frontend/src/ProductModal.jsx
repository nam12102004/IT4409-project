import { motion } from 'framer-motion';

export function ProductModal({ id, onClose }) {
  return (
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-10"
    >
      
      <motion.div
        
        layoutId={`card-container-${id}`}
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-4xl h-auto bg-white rounded-2xl shadow-2xl p-8"
      >
        <motion.h2 
          layoutId={`card-title-${id}`} 
          className="text-4xl font-bold text-gray-800"
        >
          Sản phẩm Mẫu
        </motion.h2>
        
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-gray-600 mt-6 text-lg"
        >
          Lam Web di
        </motion.p>
        
        <motion.button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Đóng
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
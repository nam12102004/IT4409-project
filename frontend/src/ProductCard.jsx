import { motion } from 'framer-motion';


export function ProductCard({ id, onClick }) {
  return (
    <div className="flex justify-center p-10">
      <motion.div
        
        layoutId={`card-container-${id}`}
        onClick={() => onClick(id)}
        className="w-72 h-96 bg-white rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
      >
        <motion.div className="p-6">
          <motion.h2 
            layoutId={`card-title-${id}`} 
            className="text-2xl font-bold text-gray-800"
          >
            Sản phẩm Mẫu
          </motion.h2>
          <motion.p className="text-gray-600 mt-2">
            Click vào để xem chi tiết
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
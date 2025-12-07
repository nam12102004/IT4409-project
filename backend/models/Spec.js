import mongoose from 'mongoose';

const SpecSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ví dụ: 'Intel Core i3', '8GB DDR4'
  type: { type: String, required: true }, // ví dụ: 'cpu', 'ram', 'storage'
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // n-1: mỗi thông số thuộc 1 category
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // n-1: mỗi thông số có thể gắn với nhiều sản phẩm
});

export default mongoose.model('Spec', SpecSchema);
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // Giá sau giảm
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String }, // Thương hiệu (Intel, AMD, Dell, HP...)
    images: [{ type: String }],

    // ===== THÊM MỚI - Khớp với Frontend =====

    // Variants (phiên bản sản phẩm: RAM, SSD, màu sắc...)
    variants: [
      {
        ram: { type: String }, // "8GB", "16GB"
        ssd: { type: String }, // "256GB", "512GB"
        color: { type: String }, // "Bạc", "Đen"
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        sku: { type: String }, // Mã sản phẩm
      },
    ],

    // Điểm nổi bật
    highlights: [{ type: String }], // ["Intel Core i7", "RAM 16GB", "SSD 512GB"]

    // Tính năng chi tiết
    features: {
      processor: { type: String }, // "Intel Core i7-1355U"
      ram: { type: String }, // "16GB DDR4"
      storage: { type: String }, // "512GB NVMe SSD"
      display: { type: String }, // "15.6 inch Full HD"
      graphics: { type: String }, // "Intel Iris Xe Graphics"
      battery: { type: String }, // "56Wh"
      weight: { type: String }, // "1.8kg"
      os: { type: String }, // "Windows 11 Home"
    },

    // Thông tin khác
    warranty: { type: String, default: "12 tháng" }, // Bảo hành
    origin: { type: String, default: "Chính hãng" }, // Xuất xứ

    // Đánh giá
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    // Thông số kỹ thuật (flexible object)
    specifications: { type: mongoose.Schema.Types.Mixed },

    // Trạng thái
    isActive: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, brand: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model("Product", ProductSchema);

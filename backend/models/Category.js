import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }, // URL-friendly name
    description: { type: String },
    icon: { type: String }, // Emoji hoặc URL icon (💻, 📱)
    image: { type: String }, // URL hình ảnh category
    subcategories: [{ type: String }], // Danh mục con ["Gaming Laptop", "Ultrabook"]
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto generate slug từ name
CategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

const Category = mongoose.model("Category", CategorySchema);


export const DEFAULT_CATEGORIES = [
  "Laptop nhập khẩu",
  "Laptop chính hãng",
  "Màn hình di động",
  "Máy chơi game/Game Console",
  "Kính Thực Tế Ảo VR/AR",
  "Bàn phím",
  "Chuột",
  "Balo, Túi",
  "Ghế công thái học",
  "Bàn nâng hạ",
  "Hộc tủ",
  "Arm màn hình",
  "Phụ kiện Setup",
  "Ram",
  "Ổ cứng",
  "Merchandise"
];

export default Category;

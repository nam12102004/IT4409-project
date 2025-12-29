import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    icon: { type: String },
    image: { type: String },
    subcategories: [{ type: String }],
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
  "Laptop",
  "Điện thoại",
  "PC",
  "Headphone",
  "Charger",
  "Monitor",
  "Battery",
  "Tablet",
];

export default Category;

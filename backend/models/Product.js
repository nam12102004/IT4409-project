import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // tham chiếu Category
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);

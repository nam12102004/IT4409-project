import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, 
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

export const DEFAULT_CATEGORIES = [
  'Laptop',
  'Điện thoại',
  'PC',
  'Headphone',
  'Charger',
  'Monitor',
  'Battery',
  'Tablet',
];

export default Category;

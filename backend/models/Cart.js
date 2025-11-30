import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Cart", CartSchema);

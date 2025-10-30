import mongoose from "mongoose";

export const EOrderStatus = {
  WaitingForPayment: "waiting_for_payment",
  Pending: "pending",
  Confirmed: "confirmed",
  Cancelled: "cancelled",
};

export const EPaymentMethod = {
  Card: "card",
  Cash: "cash",
  Zalopay: "zalopay",
  Vnpay: "vnpay",
};

const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        shipmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shipment",
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        productDiscountCode: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DiscountCode",
        },
        shippingDiscountCode: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DiscountCode",
        },
        price: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
      },
    ],
    orderStatus: {
      type: String,
      enum: Object.values(EOrderStatus),
      default: EOrderStatus.Pending,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      required: true,
    },
    shippingAddress: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);

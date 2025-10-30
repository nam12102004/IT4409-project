
import mongoose from "mongoose";

export const EUserRole = {
  Customer: "customer",
  StoreOwner: "storeOwner",
  DeliveryPersonnel: "deliveryPersonnel",
  DeliveryCompany: "deliveryCompany",
  Admin: "admin",
};


const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(EUserRole), required: true },
    phoneNumber: { type: String, required: true },
    addresses: [{ type: String, required: true }],
    avatarPicture: { type: String },
    vehicleLicenseNumber: { type: String },
    discountCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiscountCode" }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);


export default mongoose.model("User", UserSchema);

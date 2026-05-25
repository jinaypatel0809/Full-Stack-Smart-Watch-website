import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId:  { type: String },
  name:       { type: String, required: true },
  shortName:  { type: String },
  price:      { type: Number, required: true },
  oldPrice:   { type: Number },
  discount:   { type: Number },
  thumb:      { type: String },
  color:      { type: String },
  qty:        { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName:  { type: String },
    userEmail: { type: String },
    items:     [orderItemSchema],
    subtotal:  { type: Number, required: true },
    delivery:  { type: Number, default: 0 },
    total:     { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
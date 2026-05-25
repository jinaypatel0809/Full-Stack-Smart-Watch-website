import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex:  { type: String, default: "#000000" },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    shortName:  { type: String, trim: true },
    section:    {
      type: String,
      required: true,
      enum: ["trending", "watches", "smartwatches", "vyb", "sale", "gifting", "accessories"],
    },
    category:   { type: String, default: "" },
    price:      { type: Number, required: true },
    oldPrice:   { type: Number },
    discount:   { type: Number },
    rating:     { type: Number, default: 4.5 },
    reviews:    { type: Number, default: 0 },
    badge:      { type: String, default: "" },
    gender:     { type: String, default: "Unisex" },
    size:       { type: String, default: "Medium" },
    strapColor: { type: String, default: "Black" },
    available:  { type: Boolean, default: true },
    thumb:      { type: String, required: true },
    images:     [{ type: String }],
    description:{ type: String, default: "" },
    features:   [{ type: String }],
    colors:     [colorSchema],
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
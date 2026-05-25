import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ── GET all products by section ──────────────────────────────
// GET /api/products?section=trending
// GET /api/products?section=watches
router.get("/", async (req, res) => {
  try {
    const { section } = req.query;
    const query = section ? { section } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET single product ────────────────────────────────────────
// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── CREATE product (admin only) ───────────────────────────────
// POST /api/products
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      name, shortName, section, category, price, oldPrice, discount,
      rating, reviews, badge, gender, size, strapColor, available,
      thumb, images, description, features, colors,
    } = req.body;

    if (!name || !section || !price || !thumb) {
      return res.status(400).json({ message: "name, section, price and thumb are required." });
    }

    const product = await Product.create({
      name, shortName: shortName || name, section, category, price,
      oldPrice, discount, rating, reviews, badge, gender, size,
      strapColor, available, thumb, images, description, features, colors,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Product added successfully!", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── UPDATE product (admin only) ───────────────────────────────
// PUT /api/products/:id
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated!", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── DELETE product (admin only) ───────────────────────────────
// DELETE /api/products/:id
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
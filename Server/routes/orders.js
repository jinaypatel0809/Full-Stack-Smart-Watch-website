import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ── Place Order (logged-in user) ─────────────────────────────
// POST /api/orders
router.post("/", protect, async (req, res) => {
  try {
    const { items, subtotal, delivery, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const order = await Order.create({
      user:      req.user._id,
      userName:  req.user.name,
      userEmail: req.user.email,
      items,
      subtotal,
      delivery:  delivery || 0,
      total,
      status:    "confirmed",
    });

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── Get my orders (logged-in user) ──────────────────────────
// GET /api/orders/my
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── Get ALL orders (admin only) ──────────────────────────────
// GET /api/orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── Update order status (admin only) ────────────────────────
// PATCH /api/orders/:id/status
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Status updated!", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// CORS Configuration
// ─────────────────────────────────────────────

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without origin
      // (Postman / Mobile Apps)
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost
      if (
        origin.startsWith("http://localhost")
      ) {
        return callback(null, true);
      }

      // Allow all Vercel domains
      if (
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      // Block other origins
      return callback(
        new Error("CORS not allowed for this origin: " + origin)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

app.use(express.json());

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ─────────────────────────────────────────────
// Default Route
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fastrack API is running 🚀",
  });
});

// ─────────────────────────────────────────────
// MongoDB Connection
// ─────────────────────────────────────────────

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch((err) => {

    console.error("❌ MongoDB connection error:", err.message);

    process.exit(1);

  });
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import axios from "axios"; // Added axios for chatbot integration

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const HF_API_KEY = process.env.HF_API_KEY;
const __dirname = path.resolve();

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Product Data for Chatbot
const PRODUCTS = [
  { name: "Redmi Note 10 Pro", price: 18000 },
  { name: "AB: The Autobiography", price: 512 },
  { name: "Nike Men's Color Block Tee", price: 2000 },
  { name: "puma rs-x men's sneakers", price: 5000 },
  { name: "ray-ban clubmaster square sunglasses", price: 800 },
  { name: "wrogn men's biker jacket", price: 2000 },
  { name: "raymond men's slim fit suit", price: 1500 },
  { name: "puma phase backpack", price: 1100 },
  { name: "apple iphone 16 pro max", price: 180000 },
  { name: "boat airdopes 141", price: 1500 },
  { name: "samsung galaxy tab s10 ultra 5g", price: 122999 },
  { name: "Asus ROG Strix G15", price: 164990 },
  { name: "Marshall Major IV", price: 12999 },
  { name: "Sony Alpha 1", price: 520000 },
  { name: "The Grapevine", price: 1200 },
  { name: "One World Under Doom #1", price: 399 },
];

// Chatbot Route
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);

    if (!message) {
      return res.status(400).json({ response: "No message provided." });
    }

    // Extract price from message
    const priceMatch = message.match(/\d+/);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[0], 10);
      console.log("Filtering products under:", maxPrice);

      const filteredProducts = PRODUCTS.filter((p) => p.price <= maxPrice);
      return res.json({
        response: filteredProducts.length > 0 ? filteredProducts : "No products found under this price.",
      });
    }

    // Call Hugging Face API
    console.log("Calling Hugging Face API...");
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      { inputs: message },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    console.log("Hugging Face Response:", response.data);
    res.json({ response: response.data });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ response: "Internal server error. Try again later." });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

// server.js or app.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import chatRoutes from "./routes/chatbot.route.js"; // Import chatbot route

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import sellerRoutes from "./routes/seller.route.js"; // New import for seller routes
import { connectDB } from "./lib/db.js";
import analyticsMock from "./mock/analytics.mock.js";

// Import role middleware
import { customerRoute, adminRoute, sellerRoute } from "./middleware/role.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", chatRoutes); // Add this line to integrate the chatbot route

app.use("/api/seller", sellerRoute, sellerRoutes);

// Example for protecting admin routes (if you have any)
app.use("/api/admin", adminRoute, adminRoute);

// Example for customer route (if needed)
app.use("/api/customer", customerRoute, customerRoute);

if (process.env.NODE_ENV !== "production") {
  app.get("/api/analytics", (req, res) => {
    res.status(200).json(analyticsMock);
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});

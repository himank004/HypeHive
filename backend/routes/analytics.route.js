import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
  getCategorySales,
  getTopProducts,
  getUserActivity,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// 🔹 Route to get overall analytics
router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    // Disable caching for dynamic analytics data
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    const analytics = await getAnalyticsData();
    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Route to get daily sales data (date range)
router.get("/sales/daily", protectRoute, adminRoute, async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const dailySales = await getDailySalesData(startDate, endDate);
    res.json(dailySales);
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Route to get category-based sales data
router.get("/sales/categories", protectRoute, adminRoute, async (req, res) => {
  try {
    const categorySales = await getCategorySales();
    res.json(categorySales);
  } catch (error) {
    console.error("Error fetching category sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Route to get top-selling products
router.get("/sales/top-products", protectRoute, adminRoute, async (req, res) => {
  try {
    const topProducts = await getTopProducts();
    res.json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Route to get active users in the last N days
router.get("/users/active", protectRoute, adminRoute, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7; // Default to last 7 days
    const activeUsers = await getUserActivity(days);
    res.json({ activeUsers });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

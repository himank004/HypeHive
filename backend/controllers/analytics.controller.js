import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Get Basic Analytics Data
export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // Group all orders together
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales = 0, totalRevenue = 0 } = salesData[0] || {};

  return { users: totalUsers, products: totalProducts, totalSales, totalRevenue };
};

// Get Daily Sales Data for a Specific Date Range
export const getDailySalesData = async (startDate, endDate) => {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const dateArray = getDatesInRange(startDate, endDate);

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);
    return { date, sales: foundData?.sales || 0, revenue: foundData?.revenue || 0 };
  });
};

// Get Category-Based Sales Analysis
export const getCategorySales = async () => {
  const categorySales = await Product.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "items.productId",
        as: "orders",
      },
    },
    { $unwind: "$orders" },
    {
      $group: {
        _id: "$category", // Group by category
        totalSales: { $sum: "$orders.items.quantity" },
        totalRevenue: { $sum: "$orders.items.totalAmount" },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return categorySales;
};

// Get Top-Selling Products
export const getTopProducts = async () => {
  const topProducts = await Order.aggregate([
    { $unwind: "$items" }, // Expand items array
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $project: { product: "$productDetails.name", totalSold: 1 } },
  ]);

  return topProducts;
};

// Get User Activity (Active Users)
export const getUserActivity = async (days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const activeUsers = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $match: { "orders.createdAt": { $gte: cutoffDate } },
    },
    {
      $count: "activeUsers",
    },
  ]);

  return activeUsers[0]?.activeUsers || 0;
};

// Generate a Range of Dates
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

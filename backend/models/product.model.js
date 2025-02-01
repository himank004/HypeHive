import mongoose from "mongoose";

// Schema for tracking product sales and revenue
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    salesData: {
      dailySales: {
        type: Number,
        default: 0, // Track daily sales
      },
      monthlySales: {
        type: Number,
        default: 0, // Track monthly sales
      },
      yearlySales: {
        type: Number,
        default: 0, // Track yearly sales
      },
      totalSales: {
        type: Number,
        default: 0, // Total number of sales
      },
      totalRevenue: {
        type: Number,
        default: 0, // Total revenue from the product
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

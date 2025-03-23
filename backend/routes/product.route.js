import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductById,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
    recommendProducts,
    searchProducts // Import the recommendProducts controller
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes
router.get("/", protectRoute, adminRoute, getAllProducts); // Get all products
router.get("/featured", getFeaturedProducts); // Get featured products
router.get("/category/:category", getProductsByCategory); // Get products by category
router.get("/recommendations", getRecommendedProducts); // Get recommended products (random sampling)
router.post("/recommendations", protectRoute, recommendProducts); // Get AI-based recommendations
router.get("/:id", getProductById); // Get a single product by its ID
router.get("/search", searchProducts); // Search for products

// Create a new product with size options
router.post("/", protectRoute, adminRoute, createProduct);

// Toggle featured status for a product
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// Delete a product by its ID
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;

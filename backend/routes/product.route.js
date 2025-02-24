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
    recommendProducts, // Import the recommendProducts controller
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes
router.get("/", protectRoute, adminRoute, getAllProducts); // Get all products
router.get("/featured", getFeaturedProducts); // Get featured products
router.get("/category/:category", getProductsByCategory); // Get products by category
router.get("/recommendations", getRecommendedProducts); // Get recommended products (random sampling)
router.post("/recommendations", recommendProducts); // Get AI-based recommendations
router.get("/:id", getProductById); // Get a single product by its ID

router.post("/", protectRoute, adminRoute, createProduct); // Create a new product
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); // Toggle featured status for a product
router.delete("/:id", protectRoute, adminRoute, deleteProduct); // Delete a product by its ID

export default router;

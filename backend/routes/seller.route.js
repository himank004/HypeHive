import express from "express";
import { protectRoute, sellerRoute } from "../middleware/auth.middleware.js";
import { listSellerProducts, createSellerProduct } from "../controllers/seller.controller.js";

const router = express.Router();

router.use(protectRoute); // Protect all routes
router.use(sellerRoute);  // Restrict to sellers

// Seller-specific routes
router.get("/products", listSellerProducts);
router.post("/products", createSellerProduct);

export default router;

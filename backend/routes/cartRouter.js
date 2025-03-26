import express from "express";
import {
    fetchCart,
    addToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart, // Import clearCart function
} from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js";
import { ensureVisitorSession } from "../middleware/visitorId.js";

const router = express.Router();

// Unified Cart Routes for Users and Visitors
router.get("/cart", ensureVisitorSession, fetchCart); // Fetch cart
router.post("/cart/add", ensureVisitorSession, addToCart); // Add item to cart
router.post("/cart/remove", ensureVisitorSession, removeItemFromCart); // Remove item from cart
router.post("/cart/update", ensureVisitorSession, updateCartItemQuantity); // Update item quantity in cart
router.post("/cart/clear", ensureVisitorSession, clearCart); // Clear the entire cart

export default router;
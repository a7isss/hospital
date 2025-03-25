// cartRouter.js
import express from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

// Routes
router.post("/add", addToCart); // Add item to cart
router.get("/:userId", getCart); // Get user's cart
router.delete("/remove", removeFromCart); // Remove item from cart
router.put("/update", updateCartQuantity); // Update item quantity in cart

export default router;
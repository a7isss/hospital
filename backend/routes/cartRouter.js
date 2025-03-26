import express from "express";
import {
    fetchCart,
    addToCart,
    removeItemFromCart,
    // updateCartItemQuantity,
    // clearCart, // Uncomment if needed later
} from "../controllers/cartController.js"; // Use ES module import
import authUser from "../middleware/authUser.js";
import { ensureVisitorSession } from "../middleware/visitorId.js";

const cartRouter = express.Router();

// Unified Cart Routes for Users and Visitors
cartRouter.get("/cart", ensureVisitorSession, fetchCart); // Fetch cart
cartRouter.post("/cart/add", ensureVisitorSession, addToCart); // Add item to cart
cartRouter.post("/cart/remove", ensureVisitorSession, removeItemFromCart); // Remove item from cart
// cartRouter.post("/cart/update", ensureVisitorSession, updateCartItemQuantity); // Update item quantity in cart
// cartRouter.post("/cart/clear", ensureVisitorSession, clearCart); // Clear the entire cart

export default cartRouter; // Use ES module export
import express from "express";
import {
    addToCart,
    removeFromCart, // Updated function name for better readability
 //   fetchCart, // Uncomment if you need to implement fetching a full cart later
  //  updateCartItemQuantity, // Hook for updating item quantities (optional)
  //  clearCart, // Uncomment if needed for clearing the entire cart in the future
} from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js"; // Middleware for validating logged-in users
import { ensureVisitorSession } from "../middleware/visitorId.js"; // Middleware for managing visitor sessions

const cartRouter = express.Router();

//Unified Cart Routes for Users and Visitors
cartRouter.post("/add", authUser, ensureVisitorSession, addToCart); // Add item to cart (works for both user and visitor)
cartRouter.delete("/remove", authUser, ensureVisitorSession, removeFromCart); // Remove item from cart (works for both user and visitor)
//cartRouter.get("/", ensureVisitorSession, fetchCart); // To fetch the full cart (if needed later)cartRouter.put("/update", ensureVisitorSession, updateCartItemQuantity); // Update item quantity in cart (optional)
//cartRouter.delete("/clear", ensureVisitorSession, clearCart); // Clear the entire cart (if needed later)

export default cartRouter;
import express from "express";
import {
    addToCart,
    removeFromCart,
    fetchCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js"; // Middleware for logged-in users
import ensureVisitorSession from "../middleware/ensureVisitorSession.js"; // Middleware for visitor sessions

const cartRouter = express.Router();

// Add item to cart (for both users and visitors)
cartRouter.post("/add", authUser, ensureVisitorSession, addToCart);

// Remove item from cart (for both users and visitors)
cartRouter.delete("/remove", authUser, ensureVisitorSession, removeFromCart);

// Fetch cart (for both users and visitors)
cartRouter.get("/", authUser, ensureVisitorSession, fetchCart);

export default cartRouter;
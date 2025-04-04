import express from "express";
import {
    addToCart,
    removeFromCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js"; // Middleware for logged-in users

const cartRouter = express.Router();

// Add item to cart (for both users and visitors)
cartRouter.post("/add", authUser, addToCart);

// Remove item from cart (for both users and visitors)
cartRouter.delete("/remove", authUser, removeFromCart);

// Fetch cart (for both users and visitors)
cartRouter.get("/", authUser, fetchCart);

export default cartRouter;
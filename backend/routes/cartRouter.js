import express from "express";
import {
    fetchCart,
    addToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js";
import { ensureVisitorSession } from "../middleware/visitorId.js";

const router = express.Router();

// Unified Cart Routes for Users and Visitors
router.get("/cart", ensureVisitorSession, fetchCart);
router.post("/cart/add", ensureVisitorSession, addToCart);
router.post("/cart/remove", ensureVisitorSession, removeItemFromCart);
router.post("/cart/update", ensureVisitorSession, updateCartItemQuantity);
router.post("/cart/clear", ensureVisitorSession, clearCart);

export default router;
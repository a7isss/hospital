const express = require("express");
const {
    fetchCart,
    addToCart,
    removeItemFromCart,
    // updateCartItemQuantity,
    // clearCart, // Uncomment if needed later
} = require("../controllers/cartController"); // Use require for CommonJS compatibility
const authUser = require("../middleware/authUser");
const { ensureVisitorSession } = require("../middleware/visitorId");

const router = express.Router();

// Unified Cart Routes for Users and Visitors
router.get("/cart", ensureVisitorSession, fetchCart); // Fetch cart
router.post("/cart/add", ensureVisitorSession, addToCart); // Add item to cart
router.post("/cart/remove", ensureVisitorSession, removeItemFromCart); // Remove item from cart
// router.post("/cart/update", ensureVisitorSession, updateCartItemQuantity); // Update item quantity in cart
// router.post("/cart/clear", ensureVisitorSession, clearCart); // Clear the entire cart

module.exports = router;
import { VisitorModel, CartModel, ServiceModel } from "../models/models.js";

// ================================
// Helper Functions
// ================================
/**
 * Add or Update an Item in the Cart
 */
const updateCart = async (cartData, service, quantity) => {
    const existingItemIndex = cartData.cart.findIndex(item => item.itemId.equals(service._id));

    if (existingItemIndex === -1) {
        // Add new item if it doesn't exist
        cartData.cart.push({
            itemId: service._id,
            name: service.name,
            price: service.price,
            quantity,
        });
    } else {
        // Update quantity if item exists
        const existingItem = cartData.cart[existingItemIndex];
        existingItem.quantity += quantity;

        // Prevent negative quantities
        if (existingItem.quantity <= 0) {
            cartData.cart.splice(existingItemIndex, 1); // Remove item if quantity is zero or less
        }
    }

    // Recalculate total price
    cartData.totalPrice = cartData.cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return cartData;
};

/**
 * Remove an Item from the Cart
 */
const removeItemFromCart = (cartData, itemId) => {
    const itemIndex = cartData.cart.findIndex(item => item.itemId.equals(itemId));
    if (itemIndex !== -1) {
        cartData.cart.splice(itemIndex, 1);
    }

    // Recalculate total price
    cartData.totalPrice = cartData.cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// ================================
// Cart Operations
// ================================

/**
 * Add an Item to Cart (User or Visitor)
 */
export const addToCart = async (req, res) => {
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user?.id; // User ID from auth middleware
    const visitor = req.visitor; // Visitor session from middleware

    try {
        const service = await ServiceModel.findById(itemId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        if (userId) {
            let cart = await CartModel.findOne({ userId });
            if (!cart) {
                cart = new CartModel({ userId, cart: [], totalPrice: 0 });
            }

            await updateCart(cart, service, quantity);
            await cart.save();

            return res.status(200).json({ success: true, message: "Item added to user cart.", cart });
        }

        if (visitor) {
            await updateCart(visitor.sessionData, service, quantity);
            await visitor.save();

            return res.status(200).json({ success: true, message: "Item added to visitor cart.", cart: visitor.sessionData.cart });
        }

        return res.status(400).json({ success: false, message: "Invalid session." });
    } catch (error) {
        console.error("addToCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to add item to cart.", error: error.message });
    }
};

/**
 * Remove an Item from Cart (User or Visitor)
 */
export const removeFromCart = async (req, res) => {
    const { itemId } = req.body;
    const userId = req.user?.id;
    const visitor = req.visitor;

    try {
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            removeItemFromCart(cart, itemId);
            await cart.save();

            return res.status(200).json({ success: true, message: "Item removed from user cart.", cart });
        }

        if (visitor) {
            removeItemFromCart(visitor.sessionData, itemId);
            await visitor.save();

            return res.status(200).json({ success: true, message: "Item removed from visitor cart.", cart: visitor.sessionData.cart });
        }

        return res.status(400).json({ success: false, message: "Invalid session." });
    } catch (error) {
        console.error("removeFromCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to remove item from cart.", error: error.message });
    }
};

/**
 * Fetch Cart (User or Visitor)
 */
export const fetchCart = async (req, res) => {
    const userId = req.user?.id;
    const visitor = req.visitor;

    try {
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            return res.status(200).json({ success: true, cart });
        }

        if (visitor) {
            return res.status(200).json({ success: true, cart: visitor.sessionData.cart });
        }

        return res.status(400).json({ success: false, message: "Invalid session." });
    } catch (error) {
        console.error("fetchCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch cart.", error: error.message });
    }
};
import { VisitorModel, CartModel, ServiceModel } from "../models/models.js";

/**
 * Add item to a user or visitor cart.
 * Differentiates between a logged-in user (userId) or a visitor (visitorId).
 */
export const addToCart = async (req, res) => {
    const { itemId, quantity = 1 } = req.body; // `quantity` defaults to 1
    const userId = req.user?.id; // From `authUser` middleware (for authenticated users)
    const visitorId = req.visitorId; // From `ensureVisitorSession` middleware (for visitors)

    try {
        const service = await ServiceModel.findById(itemId); // Query the service
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        // Handle cart for logged-in users
        if (userId) {
            let cart = await CartModel.findOne({ userId });

            // If no cart exists, create a new one
            if (!cart) {
                cart = new CartModel({ userId, items: [], totalPrice: 0 });
            }

            // Add the item to the user’s cart
            await updateCart(cart, service, quantity);

            return res.status(200).json({
                success: true,
                message: `${service.name} added to cart (user).`,
                cart,
            });
        }

        // Handle cart for visitors
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor not found." });
            }

            // Initialize cart if it doesn't exist
            if (!visitor.sessionData.cart) {
                visitor.sessionData.cart = [];
            }

            // Add the item to the visitor's cart
            await updateCart(visitor.sessionData, service, quantity);

            await visitor.save();
            return res.status(200).json({
                success: true,
                message: `${service.name} added to cart (visitor).`,
                cart: visitor.sessionData.cart,
            });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("addToCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to add item to cart.", error: error.message });
    }
};

/**
 * Remove an item from a user or visitor cart.
 */
export const removeFromCart = async (req, res) => {
    const { itemId } = req.body;
    const userId = req.user?.id;
    const visitorId = req.visitorId;

    try {
        // Handle cart for logged-in users
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            removeItemFromCart(cart, itemId);

            await cart.save();
            return res.status(200).json({
                success: true,
                message: `Item removed from user cart.`,
                cart,
            });
        }

        // Handle cart for visitors
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Visitor cart not found." });
            }

            removeItemFromCart(visitor.sessionData, itemId);

            await visitor.save();
            return res.status(200).json({
                success: true,
                message: `Item removed from visitor cart.`,
                cart: visitor.sessionData.cart,
            });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("removeFromCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to remove item from cart.", error: error.message });
    }
};

/**
 * Utility to update (add or increment) items in a cart.
 */
const updateCart = async (cart, service, quantity) => {
    const existingItem = cart.items?.find((item) => item.itemId.toString() === service._id.toString());

    if (existingItem) {
        // Increment quantity if the item already exists in the cart
        existingItem.quantity += quantity;
    } else {
        // Otherwise, add a new item to the cart
        cart.items.push({
            itemId: service._id,
            name: service.name,
            price: service.price,
            quantity,
        });
    }

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return cart;
};

/**
 * Utility to remove items from a cart.
 */
const removeItemFromCart = (cart, itemId) => {
    // Filter out the item to be removed
    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
};
import CartModel from "../models/cartModel.js";
import VisitorModel from "../models/visitorModel.js";
import ServiceModel from "../models/serviceModel.js";

// Fetch the cart
export const fetchCart = async (req, res) => {
    const { userId } = req.body; // For logged-in users
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from Authorization header

    try {
        if (userId) {
            // Fetch cart for logged-in users
            const cart = await CartModel.findOne({ userId });
            if (!cart || (cart.items && cart.items.length === 0)) {
                // Return empty cart structure if cart doesn't exist or is empty
                return res.status(200).json({
                    success: true,
                    cart: {
                        items: [],
                        totalPrice: 0,
                    },
                });
            }
            return res.status(200).json({ success: true, cart });
        }

        if (visitorId) {
            // Fetch cart for visitors
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart || visitor.sessionData.cart.length === 0) {
                // Return empty cart structure if visitor cart doesn't exist or is empty
                return res.status(200).json({
                    success: true,
                    cart: {
                        items: [],
                        totalPrice: 0,
                    },
                });
            }
            const cart = visitor.sessionData.cart;
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            return res.status(200).json({ success: true, cart: { items: cart, totalPrice } });
        }

        // If neither userId nor visitorId is provided
        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("fetchCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch cart.", error: error.message });
    }
};
// Add an item to the cart
export const addToCart = async (req, res) => {
    const { userId, itemId, name, price, quantity } = req.body;
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from Authorization header

    try {
        if (userId) {
            // Add item for logged-in user
            const cart = await CartModel.findOneAndUpdate(
                { userId },
                {
                    $push: { items: { itemId, name, price, quantity } },
                    $inc: { totalPrice: price * quantity },
                },
                { new: true, upsert: true }
            );
            return res.status(200).json({ success: true, message: "Item added to cart.", cart });
        }

        if (visitorId) {
            // Add item for visitor
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor not found." });
            }

            const cart = visitor.sessionData.cart || [];
            const existingItemIndex = cart.findIndex((item) => item.itemId === itemId);

            if (existingItemIndex !== -1) {
                // Update quantity for existing item
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.push({ itemId, name, price, quantity });
            }

            // Update cart total price and save
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            visitor.sessionData.cart = cart;
            await visitor.save();

            return res.status(200).json({ success: true, message: "Item added to cart.", cart });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("addToCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to add item to cart.", error: error.message });
    }
};

// Remove an item from the cart
export const removeItemFromCart = async (req, res) => {
    const { userId, serviceId } = req.body;
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from Authorization header

    try {
        if (userId) {
            // Remove item for logged-in user
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "User cart not found." });
            }

            const itemIndex = cart.items.findIndex((item) => item.serviceId.toString() === serviceId);
            if (itemIndex === -1) {
                return res.status(404).json({ success: false, message: "Item not found in cart." });
            }

            const [removedItem] = cart.items.splice(itemIndex, 1);
            cart.totalPrice -= removedItem.price * removedItem.quantity;

            await cart.save();
            return res.status(200).json({ success: true, message: "Item removed from cart.", cart });
        }

        if (visitorId) {
            // Remove item for visitor
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Visitor cart not found." });
            }

            const cart = visitor.sessionData.cart;
            const itemIndex = cart.findIndex((item) => item.serviceId.toString() === serviceId);
            if (itemIndex === -1) {
                return res.status(404).json({ success: false, message: "Item not found in visitor cart." });
            }

            const [removedItem] = cart.splice(itemIndex, 1);
            visitor.sessionData.cart = cart;

            await visitor.save();
            return res.status(200).json({ success: true, message: "Item removed from visitor cart.", cart });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("removeItemFromCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to remove item from cart.", error: error.message });
    }
};

// Update the quantity of an item in the cart
export const updateCartItemQuantity = async (req, res) => {
    const { userId, serviceId, quantity } = req.body;
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from Authorization header

    try {
        if (userId) {
            // Update item quantity for logged-in user
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "User cart not found." });
            }

            const item = cart.items.find((item) => item.serviceId.toString() === serviceId);
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found in cart." });
            }

            cart.totalPrice -= item.price * item.quantity; // Remove old total
            item.quantity = quantity;
            cart.totalPrice += item.price * item.quantity; // Add new total

            await cart.save();
            return res.status(200).json({ success: true, message: "Item quantity updated.", cart });
        }

        if (visitorId) {
            // Update item quantity for visitor
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Visitor cart not found." });
            }

            const cart = visitor.sessionData.cart;
            const item = cart.find((item) => item.serviceId.toString() === serviceId);
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found in visitor cart." });
            }

            item.quantity = quantity;
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            visitor.sessionData.cart = cart;

            await visitor.save();
            return res.status(200).json({ success: true, message: "Item quantity updated.", cart });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("updateCartItemQuantity - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to update item quantity.", error: error.message });
    }
};

// Clear the cart
export const clearCart = async (req, res) => {
    const { userId } = req.body;
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from Authorization header

    try {
        if (userId) {
            await CartModel.findOneAndUpdate({ userId }, { items: [], totalPrice: 0 });
            return res.status(200).json({ success: true, message: "Cart cleared for user." });
        }

        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor not found." });
            }

            visitor.sessionData.cart = [];
            await visitor.save();
            return res.status(200).json({ success: true, message: "Cart cleared for visitor." });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("clearCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to clear cart.", error: error.message });
    }
};
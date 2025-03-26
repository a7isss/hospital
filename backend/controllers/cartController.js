import CartModel from "../models/cartModel.js";
import VisitorModel from "../models/visitorModel.js";
import ServiceModel from "../models/serviceModel.js";

// Fetch the cart (for logged-in user or visitor)
export const fetchCart = async (req, res) => {
    const { userId } = req.body; // Extracted userId from request body for logged-in users
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from header

    try {
        if (userId) {
            // Fetch cart for logged-in users
            const cart = await CartModel.findOne({ userId });
            if (!cart || cart.items.length === 0) {
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

        // No userId or visitorId provided
        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("fetchCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch cart.", error: error.message });
    }
};

// Remove an item from the cart
export const removeItemFromCart = async (req, res) => {
    const { userId } = req.body;
    const visitorId = req.headers.authorization?.replace("Bearer ", "");
    const { itemId } = req.body;

    try {
        if (userId) {
            const updatedCart = await CartModel.findOneAndUpdate(
                { userId },
                {
                    $pull: { items: { itemId } },
                },
                { new: true }
            );

            if (!updatedCart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            // Recalculate the total price
            const totalPrice = updatedCart.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            updatedCart.totalPrice = totalPrice;
            await updatedCart.save();

            return res.status(200).json({ success: true, message: "Item removed from cart.", cart: updatedCart });
        }

        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            const updatedCart = visitor.sessionData.cart.filter((item) => item.itemId.toString() !== itemId);
            visitor.sessionData.cart = updatedCart;

            // Recalculate the total price
            const totalPrice = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            await visitor.save();

            return res.status(200).json({ success: true, message: "Item removed from cart.", cart: { items: updatedCart, totalPrice } });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("removeItemFromCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to remove item from cart.", error: error.message });
    }
};
export const ensureVisitorSession = async (req, res, next) => {
    try {
        let visitorId = req.headers.authorization?.replace("Bearer ", "");

        if (!visitorId) {
            // Generate new visitorId if none is provided
            visitorId = uuidv4();

            // Create a new visitor cart
            await CartModel.create({ visitorId, items: [], totalPrice: 0 });

            // Add the visitorId to the response header (frontend should save it)
            res.setHeader("x-visitor-id", visitorId);
        } else {
            // Ensure visitor cart exists
            const visitorCart = await CartModel.findOne({ visitorId });
            if (!visitorCart) {
                // If no cart exists, create it
                await CartModel.create({ visitorId, items: [], totalPrice: 0 });
            }
        }

        req.visitorId = visitorId; // Attach to request for later use
        next();
    } catch (error) {
        console.error("Error in ensureVisitorSession:", error.message);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};

// Update the quantity of an item in the cart
export const updateCartItemQuantity = async (req, res) => {
    const { userId } = req.body;
    const visitorId = req.headers.authorization?.replace("Bearer ", "");
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ success: false, message: "Quantity must be at least 1." });
    }

    try {
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            const item = cart.items.find((item) => item.itemId.toString() === itemId);
            if (item) {
                item.quantity = quantity;
                await cart.save();

                const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cart.totalPrice = totalPrice;
                return res.status(200).json({ success: true, message: "Cart updated.", cart });
            }

            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }

        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            const item = visitor.sessionData.cart.find((item) => item.itemId.toString() === itemId);
            if (item) {
                item.quantity = quantity;
                await visitor.save();

                const totalPrice = visitor.sessionData.cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                return res.status(200).json({
                    success: true,
                    message: "Cart updated.",
                    cart: { items: visitor.sessionData.cart, totalPrice },
                });
            }

            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("updateCartItemQuantity - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to update cart.", error: error.message });
    }
};
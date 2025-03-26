import CartModel from "../models/cartModel.js";
import VisitorModel from "../models/visitorModel.js";
import ServiceModel from "../models/serviceModel.js";
// Remove item from cart
export const removeItemFromCart = async (req, res) => {
    const { userId, visitorId, serviceId } = req.body;

    try {
        if (userId) {
            // Handle removal for logged-in users
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: "User cart not found.",
                });
            }

            // Find the item to remove
            const itemIndex = cart.items.findIndex((item) => item.serviceId.toString() === serviceId);
            if (itemIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in cart.",
                });
            }

            // Update the cart's total price and remove the item
            const [removedItem] = cart.items.splice(itemIndex, 1);
            cart.totalPrice -= removedItem.price * removedItem.quantity;

            await cart.save();
            return res.status(200).json({
                success: true,
                message: "Item removed from cart.",
                cart,
            });
        }

        if (visitorId) {
            // Handle removal for visitors
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({
                    success: false,
                    message: "Visitor cart not found.",
                });
            }

            const cart = visitor.sessionData.cart;

            // Find the item to remove
            const itemIndex = cart.findIndex((item) => item.serviceId.toString() === serviceId);
            if (itemIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in visitor cart.",
                });
            }

            // Update the cart and remove the item
            const [removedItem] = cart.splice(itemIndex, 1);
            visitor.sessionData.cart = cart;

            await visitor.save();
            return res.status(200).json({
                success: true,
                message: "Item removed from visitor cart.",
                cart,
            });
        }

        res.status(400).json({
            success: false,
            message: "Either userId or visitorId is required.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove item from cart.",
            error: error.message,
        });
    }
};
// Fetch cart
export const fetchCart = async (req, res) => {
    const { userId, visitorId } = req.body;

    try {
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "User cart not found." });
            }
            return res.status(200).json({ success: true, cart });
        }

        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Visitor cart not found." });
            }
            return res.status(200).json({ success: true, cart: visitor.sessionData.cart });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch cart.", error: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    const { userId, visitorId, serviceId, quantity } = req.body;

    try {
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        if (userId) {
            let cart = await CartModel.findOne({ userId });
            if (!cart) {
                cart = new CartModel({
                    userId,
                    items: [{ serviceId, quantity: quantity || 1, price: service.price }],
                    totalPrice: service.price * (quantity || 1),
                });
            } else {
                const existingItem = cart.items.find((item) => item.serviceId.toString() === serviceId);
                if (existingItem) {
                    existingItem.quantity += quantity || 1;
                } else {
                    cart.items.push({ serviceId, quantity: quantity || 1, price: service.price });
                }
                cart.totalPrice += service.price * (quantity || 1);
            }
            await cart.save();
            return res.status(200).json({ success: true, message: "Item added to cart.", cart });
        }

        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor session not found." });
            }

            const cart = visitor.sessionData.cart || [];
            const existingItem = cart.find((item) => item.serviceId.toString() === serviceId);

            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.push({ serviceId, quantity: quantity || 1, price: service.price });
            }

            visitor.sessionData.cart = cart;
            await visitor.save();
            return res.status(200).json({ success: true, message: "Item added to visitor cart.", cart });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add item to cart.", error: error.message });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    const { userId, visitorId } = req.body;

    try {
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "User cart not found." });
            }

            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
            return res.status(200).json({ success: true, message: "Cart cleared.", cart });
        }

        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor session not found." });
            }

            visitor.sessionData.cart = [];
            await visitor.save();
            return res.status(200).json({ success: true, message: "Visitor cart cleared." });
        }

        res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to clear cart.", error: error.message });
    }
};
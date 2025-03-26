import CartModel from "../models/cartModel.js";
import VisitorModel from "../models/visitorModel.js";
import ServiceModel from "../models/serviceModel.js";

// Add an item to the cart
export const addToCart = async (req, res) => {
    const { userId } = req.body; // For logged-in users
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // For guest users
    const { itemId } = req.body; // ID of the service to be added

    try {
        // Fetch service details (price, name, etc.) from ServiceModel
        const service = await ServiceModel.findById(itemId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        // Logic for logged-in users
        if (userId) {
            let cart = await CartModel.findOne({ userId });

            // If no cart exists, create a new one
            if (!cart) {
                cart = new CartModel({ userId, items: [], totalPrice: 0 });
            }

            // Check if the item is already in the cart
            const existingItem = cart.items.find((item) => item.itemId.toString() === itemId);
            if (existingItem) {
                existingItem.quantity += 1; // Increment the quantity
            } else {
                cart.items.push({
                    itemId: service._id,
                    name: service.name,
                    price: service.price,
                    quantity: 1,
                });
            }

            // Recalculate the total price
            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json({ success: true, message: `${service.name} added to cart.`, cart });
        }

        // Logic for visitors (guest users)
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });

            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor not found." });
            }

            // Initialize cart if it doesn't exist
            if (!visitor.sessionData.cart) {
                visitor.sessionData.cart = [];
            }

            // Check if the item is already in the cart
            const existingItem = visitor.sessionData.cart.find((item) => item.itemId.toString() === itemId);
            if (existingItem) {
                existingItem.quantity += 1; // Increment the quantity
            } else {
                visitor.sessionData.cart.push({
                    itemId: service._id,
                    name: service.name,
                    price: service.price,
                    quantity: 1,
                });
            }

            // Recalculate the total price
            const totalPrice = visitor.sessionData.cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await visitor.save();
            return res.status(200).json({ success: true, message: `${service.name} added to cart.`, cart: { items: visitor.sessionData.cart, totalPrice } });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("addToCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to add item to cart.", error: error.message });
    }
};
export const removeItemFromCart = async (req, res) => {
    const { userId } = req.body; // For logged-in users
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // For guest users
    const { itemId } = req.body; // ID of the service to be removed

    try {
        // Logic for logged-in users
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            // Remove the item from the cart
            cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);

            // Recalculate the total price
            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json({ success: true, message: "Item removed from cart.", cart });
        }

        // Logic for visitors (guest users)
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });

            if (!visitor || !visitor.sessionData.cart) {
                return res.status(404).json({ success: false, message: "Cart not found." });
            }

            // Remove the item from the visitor's cart
            visitor.sessionData.cart = visitor.sessionData.cart.filter(
                (item) => item.itemId.toString() !== itemId
            );

            // Recalculate the total price
            const totalPrice = visitor.sessionData.cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await visitor.save();
            return res.status(200).json({
                success: true,
                message: "Item removed from cart.",
                cart: { items: visitor.sessionData.cart, totalPrice },
            });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("removeItemFromCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to remove item from cart.", error: error.message });
    }
};
// Fetch cart for logged-in users or visitors
export const fetchCart = async (req, res) => {
    const { userId } = req.body; // For logged-in users
    const visitorId = req.headers.authorization?.replace("Bearer ", ""); // For guest users

    try {
        // Fetch cart for logged-in users
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart || cart.items.length === 0) {
                return res.status(200).json({ success: true, message: "Cart is empty.", cart: { items: [], totalPrice: 0 } });
            }
            return res.status(200).json({ success: true, cart });
        }

        // Fetch cart for visitors (guest users)
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });

            if (!visitor) {
                return res.status(404).json({ success: false, message: "Visitor not found." });
            }

            const cart = visitor.sessionData.cart || [];
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return res.status(200).json({ success: true, cart: { items: cart, totalPrice } });
        }

        return res.status(400).json({ success: false, message: "Either userId or visitorId is required." });
    } catch (error) {
        console.error("fetchCart - Error:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch cart.", error: error.message });
    }
};
// cartController.js
import CartModel from "../models/cartModel.js";
import ServiceModel from "../models/serviceModel.js";
import VisitorModel from "../models/visitorModel.js";
export const clearCart = async (req, res) => {
    try {
        const { userId, visitorId } = req.body;

        if (!userId && !visitorId) {
            return res.status(400).json({
                success: false,
                message: "Either a user ID or visitor ID is required to clear the cart.",
            });
        }

        // Handle user cart
        if (userId) {
            const cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found for the user.",
                });
            }

            // Clear items and reset cart
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();

            return res.status(200).json({
                success: true,
                message: "Cart cleared successfully for the user.",
                cart,
            });
        }

        // Handle visitor cart (stored in sessionData in VisitorModel)
        if (visitorId) {
            const visitorSession = await VisitorModel.findOne({ visitorId });
            if (!visitorSession) {
                return res.status(404).json({
                    success: false,
                    message: "Visitor session not found.",
                });
            }

            // Clear visitor's session cart data
            visitorSession.sessionData.cart = [];
            await visitorSession.save();

            return res.status(200).json({
                success: true,
                message: "Cart cleared successfully for the visitor.",
                visitorSession,
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: err.message,
        });
    }
};
// Add to Cart
export const addToCart = async (req, res) => {
    const { userId, serviceId, quantity } = req.body;

    try {
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            // Create a new cart for the user if one doesn't exist
            cart = new CartModel({
                userId,
                items: [
                    {
                        serviceId: service._id,
                        quantity: quantity || 1,
                        price: service.price,
                    },
                ],
                totalPrice: service.price * (quantity || 1),
            });
        } else {
            // Check if the item is already in the cart
            const existingItem = cart.items.find((item) => item.serviceId.toString() === serviceId);

            if (existingItem) {
                // Update the quantity of the existing item
                existingItem.quantity += quantity || 1;
            } else {
                // Add a new item to the cart
                cart.items.push({
                    serviceId: service._id,
                    quantity: quantity || 1,
                    price: service.price,
                });
            }

            // Recalculate total price
            cart.totalPrice += service.price * (quantity || 1);
        }

        await cart.save();

        res.status(200).json({ success: true, message: "Item added to cart", cart });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add to cart", error: err.message });
    }
};

// Get Cart
export const getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await CartModel.findOne({ userId }).populate("items.serviceId");
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        res.status(200).json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch cart", error: err.message });
    }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
    const { userId, serviceId } = req.body;

    try {
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Filter out the item to be removed
        const itemToRemove = cart.items.find((item) => item.serviceId.toString() === serviceId);
        if (!itemToRemove) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        cart.items = cart.items.filter((item) => item.serviceId.toString() !== serviceId);

        // Update total price
        cart.totalPrice -= itemToRemove.price * itemToRemove.quantity;

        await cart.save();

        res.status(200).json({ success: true, message: "Item removed from cart", cart });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to remove item", error: err.message });
    }
};

// Update Quantity
export const updateCartQuantity = async (req, res) => {
    const { userId, serviceId, quantity } = req.body;

    try {
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemToUpdate = cart.items.find((item) => item.serviceId.toString() === serviceId);
        if (!itemToUpdate) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Update the quantity and recalculate the total price
        cart.totalPrice -= itemToUpdate.price * itemToUpdate.quantity; // Remove current price
        itemToUpdate.quantity = quantity; // Update quantity
        cart.totalPrice += itemToUpdate.price * quantity; // Add updated price

        await cart.save();

        res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update cart", error: err.message });
    }
};
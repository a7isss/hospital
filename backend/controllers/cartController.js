import { CartModel, ServiceModel } from "../models/models.js";

// Helper Functions
const updateCart = async (cartData, service, quantity) => {
    const existingItemIndex = cartData.cart.findIndex(item => item.itemId.equals(service._id));

    if (existingItemIndex === -1) {
        cartData.cart.push({
            itemId: service._id,
            name: service.name,
            price: service.price,
            quantity,
        });
    } else {
        const existingItem = cartData.cart[existingItemIndex];
        existingItem.quantity += quantity;

        if (existingItem.quantity <= 0) {
            cartData.cart.splice(existingItemIndex, 1);
        }
    }

    cartData.totalPrice = cartData.cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return cartData;
};

const removeItemFromCart = (cartData, itemId) => {
    const itemIndex = cartData.cart.findIndex(item => item.itemId.equals(itemId));
    if (itemIndex !== -1) {
        cartData.cart.splice(itemIndex, 1);
    }

    cartData.totalPrice = cartData.cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Cart Operations
export const addToCart = async (req, res) => {
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user?.id;

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

        return res.status(401).json({ success: false, message: "Unauthorized. Please log in to manage the cart." });
    } catch (error) {
        console.error("addToCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to add item to cart.", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { itemId } = req.body;
    const userId = req.user?.id;

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

        return res.status(401).json({ success: false, message: "Unauthorized. Please log in to manage the cart." });
    } catch (error) {
        console.error("removeFromCart - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to remove item from cart.", error: error.message });
    }
};
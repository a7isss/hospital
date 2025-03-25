// cartModel.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Associate cart with a user
    items: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, // Reference Service model
            quantity: { type: Number, required: true, default: 1 }, // Quantity of the service
            price: { type: Number, required: true }, // Price of the service at the time it's added
        },
    ],
    totalPrice: { type: Number, required: true, default: 0 }, // Total price of all cart items
    updatedAt: { type: Date, default: Date.now }, // Last time the cart was updated
});

const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default CartModel;
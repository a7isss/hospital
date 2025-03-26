import mongoose from "mongoose";

// Define schema for an individual cart item
const cartItemSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, // Links to ServiceModel
    quantity: { type: Number, default: 1, required: true }, // Quantity of the service
    price: { type: Number, required: true }, // Unit price of the service
});

// Define schema for the cart
const cartSchema = new mongoose.Schema({
    userId: { type: String, default: null }, // For logged-in users
    visitorId: { type: String, default: null }, // For visitors (anonymous users)
    items: [cartItemSchema], // Array of cart items
    totalPrice: { type: Number, default: 0 }, // Dynamic field calculated based on items
});

// Middleware to ensure total price is always accurate
cartSchema.pre("save", function (next) {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
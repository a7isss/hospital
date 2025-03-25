const cartSchema = new mongoose.Schema({
    userId: { type: String, default: null }, // For logged-in users
    visitorId: { type: String, default: null }, // For visitors
    items: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, default: 0 },
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
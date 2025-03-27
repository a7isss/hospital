import React, { useContext } from "react";
import { CartContext } from "../context/CartContext"; // Access CartContext for cart operations
import { AppContext } from "../context/AppContext"; // Access AppContext for additional service details

const Cart = () => {
    const { cart, totalPrice, removeFromCart, updateCartQuantity } = useContext(CartContext); // Access Cart context
    const { services } = useContext(AppContext); // Access services globally from AppContext

    // Helper: Get full service details based on itemId in the cart
    const getServiceDetails = (serviceId) => services.find((service) => service._id === serviceId) || {};

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-primary text-white py-4">
                <h1 className="text-3xl font-bold text-center">Your Shopping Cart</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto px-6 py-8">
                {cart.length === 0 ? (
                    // If Cart is Empty
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                        <p className="text-xl font-medium">Your cart is currently empty.</p>
                        <p className="text-sm">Browse our services and add items to your cart.</p>
                    </div>
                ) : (
                    // Cart Items List
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {cart.map((item) => {
                            const serviceDetails = getServiceDetails(item.itemId); // Fetch details about the item

                            return (
                                <div key={item.itemId} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                                    {/* Service Image */}
                                    <img
                                        src={serviceDetails.image || "https://via.placeholder.com/100"}
                                        alt={serviceDetails.name || "Service"}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />

                                    {/* Service Details */}
                                    <div className="flex-1">
                                        <h2 className="text-md font-semibold text-gray-800">
                                            {serviceDetails.name || "Service Name"}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Price: ₹{item.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Total: ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2">
                                        {/* Increase Quantity */}
                                        <button
                                            onClick={() => updateCartQuantity(item.itemId, item.quantity + 1)}
                                            className="bg-primary text-white px-2 py-1 rounded-md"
                                        >
                                            +
                                        </button>

                                        {/* Item Quantity */}
                                        <div className="text-center">{item.quantity}</div>

                                        {/* Decrease Quantity or Remove */}
                                        <button
                                            onClick={() =>
                                                item.quantity > 1
                                                    ? updateCartQuantity(item.itemId, item.quantity - 1)
                                                    : removeFromCart(item.itemId)
                                            }
                                            className="bg-secondary text-white px-2 py-1 rounded-md"
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer with Total Price */}
            <footer className="bg-gray-100 py-4 mt-auto">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-800">
                        Total Price: <span className="text-primary font-bold">₹{totalPrice.toFixed(2)}</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Cart;
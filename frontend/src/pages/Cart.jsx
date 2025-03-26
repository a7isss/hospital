import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AppContext } from "../context/AppContext";

const Cart = () => {
    const { cart, totalPrice, removeFromCart, updateCartQuantity } = useContext(CartContext); // Access cart functions from CartContext
    const { services } = useContext(AppContext); // Access services list from AppContext

    // Helper function to find full service details in AppContext using serviceId from the cart
    const getServiceDetails = (serviceId) => {
        return services.find((service) => service.id === serviceId) || {}; // Default empty object if not found
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Page Header */}
            <div className="bg-primary text-white py-4">
                <h1 className="text-3xl font-bold text-center">Your Shopping Cart</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto px-6 py-8">
                {cart.length === 0 ? (
                    // Empty Cart Message
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                        <p className="text-xl font-medium">Your cart is currently empty.</p>
                        <p className="text-sm">Explore our services and add items to your cart.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {cart.map((item) => {
                            // Fetch full details of the service for better UI display (name, description, etc.)
                            const serviceDetails = getServiceDetails(item.itemId);

                            return (
                                <div key={item.itemId} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                                    {/* Item Image */}
                                    <img
                                        src={serviceDetails.image || "https://via.placeholder.com/100"}
                                        alt={serviceDetails.name || "Service Image"}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />

                                    {/* Item Details */}
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

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        {/* Increase Quantity */}
                                        <button
                                            onClick={() => updateCartQuantity(item.itemId, item.quantity + 1)}
                                            className="bg-primary text-white px-2 py-1 rounded-md"
                                        >
                                            +
                                        </button>

                                        {/* Quantity */}
                                        <div className="text-center">{item.quantity}</div>

                                        {/* Decrease or Remove */}
                                        <button
                                            onClick={() =>
                                                item.quantity > 1
                                                    ? updateCartQuantity(item.itemId, item.quantity - 1)
                                                    : removeFromCart(item.itemId)
                                            }
                                            className="bg-secondary text-white px-2 py-1 rounded-md"
                                        >
                                            −
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
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
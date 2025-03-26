import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
    const { cart, totalPrice, removeFromCart, updateCartQuantity } = useContext(CartContext);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Page Header */}
            <div className="bg-primary text-white py-4">
                <h1 className="text-3xl font-bold text-center">Your Shopping Cart</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto px-6 py-8">
                {/* Empty Cart Message */}
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                        <p className="text-xl font-medium">Your cart is currently empty.</p>
                        <p className="text-sm">Explore our services and add items to your cart!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* List of Cart Items */}
                        {cart.map((item) => (
                            <div
                                key={item.itemId}
                                className="border border-gray-300 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between"
                            >
                                {/* Item Details */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image || "https://via.placeholder.com/100"}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.name}</h2>
                                        <p className="text-sm text-gray-600">
                                            Price: ₹{item.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Total: ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Item Actions */}
                                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                    <button
                                        onClick={() =>
                                            updateCartQuantity(item.itemId, item.quantity + 1)
                                        }
                                        className="bg-primary text-white px-3 py-1 rounded-md"
                                    >
                                        +
                                    </button>
                                    <span className="text-gray-800 text-sm font-semibold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            item.quantity > 1
                                                ? updateCartQuantity(item.itemId, item.quantity - 1)
                                                : removeFromCart(item.itemId)
                                        }
                                        className="bg-secondary text-white px-3 py-1 rounded-md"
                                    >
                                        −
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.itemId)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Total Price */}
                        <div className="text-right font-semibold text-lg text-gray-800">
                            Total Price: ₹{totalPrice.toFixed(2)}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 py-4 mt-auto">
                <div className="text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Cart;
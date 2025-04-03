import React, { useContext } from "react";
import { CartContext } from "../context/CartContext"; // Import CartContext
import useAuthStore from "../store/authStore"; // Zustand's authStore
import currIcon from "../assets/curr.svg";
import { useTranslation } from "react-i18next";

const Cart = () => {
    const { t } = useTranslation(); // Translation hook
    const { cart, totalPrice, updateCartQuantity, removeFromCart } = useContext(CartContext); // CartContext actions
    const userData = useAuthStore((state) => state.userData); // Authenticated user data from authStore
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Authentication status from authStore

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-primary text-white py-4 shadow-md">
                <h1 className="text-3xl font-bold text-center">{t("Your_Shopping_Cart")}</h1>
            </div>

            {/* Welcome message for logged-in users */}
            {isAuthenticated && userData && (
                <div className="bg-gray-100 py-4 px-6 text-gray-800 text-lg text-center">
                    {t("Welcome_Back")}, <span className="font-medium">{userData.name}</span>!
                </div>
            )}

            <div className="flex-1 container mx-auto px-6 py-8">
                {/* Empty cart message */}
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                        <p className="text-xl font-medium">{isAuthenticated ? t("Your_Cart_Is_Empty") : t("Visitor_Cart_Empty")}</p>
                        <p className="text-sm">{t("Browse_Our_Services")}</p>
                    </div>
                ) : (
                    // Cart items list
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.itemId}
                                className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 bg-white shadow hover:shadow-lg transition-shadow"
                            >
                                {/* Service Image */}
                                <img
                                    src={item.image || "https://via.placeholder.com/100"}
                                    alt={item.name || "Service"}
                                    className="w-16 h-16 object-cover rounded-md"
                                />

                                {/* Service Details */}
                                <div className="flex-1">
                                    <h2 className="text-md font-semibold text-gray-800">
                                        {item.name || "Service Name"}
                                    </h2>
                                    <div className="flex items-center text-primary font-semibold text-lg mt-1">
                                        <img
                                            src={currIcon}
                                            alt="Currency"
                                            className="h-[1.25em] w-[1.25em] mr-1 object-contain"
                                        />
                                        <span>{item.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total: {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => updateCartQuantity(item.itemId, item.quantity + 1)}
                                        className="bg-primary text-white px-2 py-1 rounded-md"
                                    >
                                        +
                                    </button>
                                    <p className="text-center font-medium">{item.quantity}</p>
                                    <button
                                        onClick={() => updateCartQuantity(item.itemId, item.quantity - 1)}
                                        className="bg-primary text-white px-2 py-1 rounded-md"
                                        disabled={item.quantity <= 1} // Disable when quantity is 1
                                    >
                                        -
                                    </button>
                                </div>

                                {/* Remove Item */}
                                <button
                                    onClick={() => removeFromCart(item.itemId)}
                                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md"
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                        ))}

                        {/* Cart Total */}
                        <div className="flex justify-between items-center border-t border-gray-300 pt-4 mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">{t("Total_Price")}</h3>
                            <div className="flex items-center text-primary font-semibold text-2xl">
                                <img
                                    src={currIcon}
                                    alt="Currency"
                                    className="h-[1.5em] w-[1.5em] mr-1 object-contain"
                                />
                                <span>{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
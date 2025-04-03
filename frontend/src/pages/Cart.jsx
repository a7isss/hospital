import React from "react";
import useAuthStore from "../store/authStore"; // Zustand's authStore
import currIcon from "../assets/curr.svg";
import { useTranslation } from "react-i18next";

const Cart = () => {
    const { t } = useTranslation(); // Translation hook

    // Pull cart-related states and methods from authStore
    const cart = useAuthStore((state) => state.cart);
    const totalPrice = useAuthStore((state) => state.totalPrice);
    const updateCartQuantity = useAuthStore((state) => state.updateCartQuantity);
    const removeFromCart = useAuthStore((state) => state.removeFromCart);

    // Auth-related states
    const userData = useAuthStore((state) => state.userData);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const visitorId = useAuthStore((state) => state.visitorId);

    // Fail-safe: Display loading or error message if cart fails to load
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);

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

            {/* Failsafe for Loading/Error States */}
            {loading && (
                <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                    <p className="text-xl font-medium">{t("Loading_Cart")}</p>
                </div>
            )}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                    <p className="text-xl font-medium text-red-600">{t("Error_Loading_Cart")}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="flex-1 container mx-auto px-6 py-8">
                    {/* Empty cart message */}
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                            <p className="text-xl font-medium">
                                {isAuthenticated ? t("Your_Cart_Is_Empty") : t("Visitor_Cart_Empty")}
                            </p>
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
                                            {item.name || t("Service_Name")}
                                        </h2>
                                        <div className="flex items-center text-primary font-semibold text-lg mt-1">
                                            <img
                                                src={currIcon}
                                                alt={t("Currency")}
                                                className="h-[1.25em] w-[1.25em] mr-1 object-contain"
                                            />
                                            <span>{item.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {t("Total")}: {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col gap-2">
                                        {/* Increase Quantity */}
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(item.itemId, item.quantity + 1)
                                            }
                                            className="px-3 py-1 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
                                        >
                                            {t("Increase")}
                                        </button>

                                        {/* Decrease Quantity */}
                                        {item.quantity > 1 && (
                                            <button
                                                onClick={() =>
                                                    updateCartQuantity(item.itemId, item.quantity - 1)
                                                }
                                                className="px-3 py-1 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 transition"
                                            >
                                                {t("Decrease")}
                                            </button>
                                        )}

                                        {/* Remove from Cart */}
                                        <button
                                            onClick={() => removeFromCart(item.itemId)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
                                        >
                                            {t("Remove")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Total Price */}
            {cart.length > 0 && (
                <div className="text-center py-4 bg-white shadow-md">
                    <h2 className="text-lg font-medium">
                        {t("Total_Price")}: ₹{totalPrice.toFixed(2)}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default Cart;
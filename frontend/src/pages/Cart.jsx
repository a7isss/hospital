import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useVisitor } from "../context/VisitorContext";
import { AppContext } from "../context/AppContext";
import currIcon from "../assets/curr.svg";
import { useTranslation } from "react-i18next";

const Cart = () => {
    const { t } = useTranslation();
    const { cart, totalPrice, updateCartQuantity, removeFromCart } = useContext(CartContext);
    const { visitorId } = useVisitor();
    const { services } = useContext(AppContext);

    // Helper: Get service details (name, image) from AppContext
    const getServiceDetails = (itemId) => {
        return services.find((service) => service._id === itemId) || {};
    };

    if (!visitorId) {
        return <div>{t("loading")}</div>; // Handle visitorId initialization
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-primary text-white py-4 shadow-md">
                <h1 className="text-3xl font-bold text-center">{t("Your_Shopping_Cart")}</h1>
            </div>

            {/* Cart Items */}
            <div className="flex-1 container mx-auto px-6 py-8">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                        <p className="text-xl font-medium">{t("Your_Cart_Is_Empty")}</p>
                        <p className="text-sm">{t("Browse_Our_Services")}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map((item) => {
                            const service = getServiceDetails(item.itemId);
                            return (
                                <div
                                    key={item.itemId}
                                    className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 bg-white shadow hover:shadow-lg transition-shadow"
                                >
                                    {/* Service Image */}
                                    <img
                                        src={service.image || "https://via.placeholder.com/100"}
                                        alt={service.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />

                                    {/* Service Details */}
                                    <div className="flex-1">
                                        <h2 className="text-md font-semibold text-gray-800">
                                            {service.name || "Service Name"}
                                        </h2>
                                        <div className="flex items-center text-primary font-semibold text-lg mt-1">
                                            <img
                                                src={currIcon}
                                                alt="Currency Icon"
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
                                        <div className="text-center">{item.quantity}</div>
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
                <div className="container mx-auto text-center">
                    <p className="text-lg font-medium text-gray-800 mb-4">
                        {t("Total_Price")}:{" "}
                        <span className="text-primary font-bold">
              {totalPrice.toFixed(2)}
            </span>
                    </p>
                    <button className="bg-white border border-primary text-primary px-6 py-2 rounded-md shadow hover:bg-primary hover:text-white transition">
                        {t("Pay")}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Cart;

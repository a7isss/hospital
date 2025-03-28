import React, { useContext } from "react";
import { CartContext } from "../context/CartContext"; // Access CartContext for cart operations
import { AppContext } from "../context/AppContext"; // Access AppContext for additional service details
import { VisitorContext } from "../context/VisitorContext"; // Import VisitorContext
import curry from "../assets/curr.svg"; // Adjust the path as necessary
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Cart = () => {
    const { t } = useTranslation(); // Initialize translation
    const { cart, totalPrice, removeFromCart, updateCartQuantity } = useContext(CartContext); // Access Cart context
    const { services } = useContext(AppContext); // Access services globally from AppContext
    const { visitorId } = useContext(VisitorContext); // Access visitorId from VisitorContext

    // Helper: Get full service details based on itemId in the cart
    const getServiceDetails = (serviceId) => services.find((service) => service._id === serviceId) || {};

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-primary text-white py-4 shadow-md">
                <h1 className="text-3xl font-bold text-center">{t('Your_Shopping_Cart')}</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto px-6 py-8">
                {cart.length === 0 ? (
                    // If Cart is Empty
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                        <p className="text-xl font-medium">{t('Your_Cart_Is_Empty')}</p>
                        <p className="text-sm">{t('Browse_Our_Services')}</p>
                    </div>
                ) : (
                    // Cart Items List
                    <div className="space-y-4">
                        {cart.map((item) => {
                            const serviceDetails = getServiceDetails(item.itemId); // Fetch details about the item

                            return (
                                <div key={item.itemId} className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 bg-white shadow hover:shadow-lg transition-shadow">
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
                                        <div className="flex items-center text-primary font-semibold text-lg mt-1">
                                            <img
                                                src={curry} // Use the imported currency image
                                                alt="Currency Icon"
                                                className="h-[1.25em] w-[1.25em] mr-1 object-contain" // Presizes and aligns to match price font
                                            />
                                            <span>{item.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Total: {(item.price * item.quantity).toFixed(2)}
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

            {/* Footer with Total Price and Pay Button */}
            <footer className="bg-gray-100 py-4 mt-auto">
                <div className="container mx-auto text-center">
                    <p className="text-lg font-medium text-gray-800 mb-4">
                        Total Price: <span className="text-primary font-bold">₹{totalPrice.toFixed(2)}</span>
                    </p>
                    <button className="bg-white border border-primary text-primary px-6 py-2 rounded-md shadow hover:bg-primary hover:text-white transition">
                        Pay
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Cart;

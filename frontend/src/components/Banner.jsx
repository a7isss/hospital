import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore"; // Zustand authStore for global state
import { toast } from "react-toastify";
import curry from "../assets/curr.svg"; // Placeholder image for currency
import doctorImage2 from "../assets/doc1.png"; // Placeholder image for services
import { useTranslation } from "react-i18next"; // Translation hook for multi-language support

const Banner = () => {
    // Access state and actions from authStore
    const {
        services,
        fetchServices,
        addToCart,
        isAuthenticated,
        userData,
        loading,
    } = useAuthStore((state) => ({
        services: state.services, // Global list of services
        fetchServices: state.fetchServices, // Action to fetch services
        addToCart: state.addToCart, // Action to add a service to the cart
        isAuthenticated: state.isAuthenticated, // User authentication status
        userData: state.userData, // Logged in user data
        loading: state.loading, // Global loading state
    }));

    const { t } = useTranslation(); // Translation hook for internationalization
    const [loadingStates, setLoadingStates] = useState({}); // Tracks the "add to cart" button state for each service

    // Fetch services on component mount if not already available
    useEffect(() => {
        if (services.length === 0) fetchServices();
    }, [services, fetchServices]);

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true })); // Show loading state for the specific service

        try {
            if (!service.price) {
                toast.error(
                    `${service.name} ${t("cart_error_price_missing")}`
                ); // Show error toast if price is missing
                return;
            }

            // Add to cart through Zustand's store
            addToCart({
                itemId: service._id,
                name: service.name,
                price: service.price,
                image: service.image || doctorImage2,
                quantity: 1,
            });

            // Success notification
            toast.success(`${service.name} ${t("added_to_cart")}`);
        } catch (error) {
            // Error notification
            toast.error(t("cart_error"));
            console.error("Error adding to cart:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service._id]: false })); // Reset the loading state
        }
    };

    return (
        <div className="banner-container p-6">
            <h1 className="text-3xl font-bold text-center mb-8">{t("our_services")}</h1>

            {/* Loading State */}
            {loading ? (
                <div className="text-center">
                    <p className="text-gray-500">{t("loading_services")}</p>
                </div>
            ) : services && services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
                        >
                            {/* Service Image */}
                            <div className="w-full flex items-center justify-center bg-gray-100 mb-4">
                                <img
                                    src={service.image || doctorImage2}
                                    alt={service.name}
                                    className="w-full object-contain max-h-48"
                                />
                            </div>
                            {/* Service Details */}
                            <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{service.description || t("no_description")}</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <img
                                    src={curry}
                                    alt="Currency"
                                    className="w-4 h-4"
                                />
                                <span className="text-lg font-bold">{`${service.price || 0} USD`}</span>
                            </div>
                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(service)}
                                className={`mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
                                    loadingStates[service._id] ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={loadingStates[service._id]}
                            >
                                {loadingStates[service._id] ? t("adding") : t("add_to_cart")}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-500">{t("no_services_available")}</p>
                </div>
            )}

            {/* Personalized Message for Authenticated Users */}
            {isAuthenticated && userData && (
                <p className="text-gray-700 mt-4 text-center">{`${t("welcome_back")}, ${userData.name}!`}</p>
            )}
        </div>
    );
};

export default Banner;
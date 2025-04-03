import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore"; // Zustand authStore for global state
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ServiceBanner = () => {
    // Access state and actions from authStore
    const {
        services,
        fetchServices,
        addToCart,
        loading,
    } = useAuthStore((state) => ({
        services: state.services, // List of services from the global store
        fetchServices: state.fetchServices, // Fetch services action
        addToCart: state.addToCart, // Add to cart action
        loading: state.loading, // Global loading state
    }));

    const [loadingStates, setLoadingStates] = useState({}); // Track the loading state for each service
    const { t } = useTranslation(); // Translation for multi-language support

    // Fetch services on component mount if services aren't already loaded
    useEffect(() => {
        if (services.length === 0) fetchServices();
    }, [services, fetchServices]);

    // Handle adding a service to the cart
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true })); // Set loading state for the specific service

        try {
            if (!service.price) {
                toast.error(
                    `${service.name} ${t("cart_error_price_missing")}`
                ); // Show error if price is missing
                return;
            }

            // Add to cart via Zustand's global action
            addToCart({
                itemId: service._id,
                name: service.name,
                price: service.price,
                image: service.image,
                quantity: 1,
            });

            // Notify success
            toast.success(`${service.name} ${t("added_to_cart")}`);
        } catch (error) {
            // Notify error
            toast.error(t("cart_error"));
            console.error("Error adding to cart:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service._id]: false })); // Reset the loading state
        }
    };

    return (
        <div className="banner-container">
            <h1 className="text-3xl font-bold text-center mb-8">{t("our_services")}</h1>

            {/* Loading State */}
            {loading ? (
                <div className="text-center">
                    <p className="text-gray-500">{t("loading_services")}</p>
                </div>
            ) : services && services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render each service */}
                    {services.map((service) => (
                        <div
                            key={service._id}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
                        >
                            {/* Service Name */}
                            <h3 className="text-xl font-bold">{service.name}</h3>
                            {/* Service Price */}
                            <p className="text-gray-600">₹{service.price}</p>
                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(service)}
                                className={`mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-transform ${
                                    loadingStates[service._id] ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={loadingStates[service._id]} // Disable button while loading
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
        </div>
    );
};

export default ServiceBanner;
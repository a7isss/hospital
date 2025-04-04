import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore"; // Zustand authStore for authenticated users
import useVisitorStore from "../store/visitorStore"; // Zustand visitorStore for visitors
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ServiceBanner = () => {
    const { t } = useTranslation();

    // Handles both Authenticated and Visitor Logic
    const {
        isAuthenticated,
        addToCart: addToAuthCart,
        loading: authLoading,
        fetchServices: fetchAuthServices,
        services: authServices,
    } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated, // Is the user authenticated
        addToCart: state.addToCart, // Add to cart action for authenticated users
        loading: state.loading, // Loading state for authenticated API
        fetchServices: state.fetchServices, // Fetch services action for authenticated users
        services: state.services, // Fetched services for authenticated users
    }));

    const {
        generateVisitorId,
        addToCart: addToVisitorCart,
        fetchServices: fetchVisitorServices,
        services: visitorServices,
        visitorId,
    } = useVisitorStore((state) => ({
        generateVisitorId: state.generateVisitorId, // Generate visitor ID if needed
        addToCart: state.addToCart, // Visitor-specific add to cart
        fetchServices: state.fetchServices, // Fetch services for visitors
        services: state.services, // Services for visitors
        visitorId: state.visitorId, // Visitor ID
    }));

    const [services, setServices] = useState([]); // Local unified services for rendering
    const [loadingStates, setLoadingStates] = useState({}); // Loading states for individual buttons
    const [loading, setLoading] = useState(false); // Global loading state

    // Fetch appropriate services based on user state
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                if (isAuthenticated) {
                    // Fetch authenticated user's services
                    if (authServices.length === 0) {
                        await fetchAuthServices(); // Fetch if not already loaded
                    }
                    setServices(authServices);
                } else {
                    // Handle visitor logic
                    generateVisitorId(); // Ensure visitor ID exists
                    if (visitorServices.length === 0) {
                        await fetchVisitorServices(); // Fetch if not already loaded
                    }
                    setServices(visitorServices);
                }
            } catch (err) {
                console.error("Error fetching services:", err.message);
                toast.error(t("error_loading_services"));
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [isAuthenticated, authServices, visitorServices, fetchAuthServices, fetchVisitorServices, generateVisitorId]);

    // Add to cart logic based on user state
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true }));
        try {
            if (!service.price) {
                toast.error(`${service.name} ${t("cart_error_price_missing")}`);
                return;
            }

            if (isAuthenticated) {
                // Add to authenticated user's cart
                addToAuthCart({
                    itemId: service._id,
                    name: service.name,
                    price: service.price,
                    image: service.image,
                    quantity: 1,
                });
            } else {
                // Add to visitor cart
                addToVisitorCart({
                    itemId: service._id,
                    name: service.name,
                    price: service.price,
                    image: service.image,
                    quantity: 1,
                });
                console.log(`Visitor (${visitorId}) added item to cart.`);
            }

            toast.success(`${service.name} ${t("added_to_cart")}`);
        } catch (error) {
            console.error("Error adding to cart:", error.message);
            toast.error(t("cart_error"));
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service._id]: false }));
        }
    };

    return (
        <div className="banner-container">
            <h1 className="text-3xl font-bold text-center mb-8">{t("our_services")}</h1>

            {/* Loading state */}
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
                                disabled={loadingStates[service._id]}
                            >
                                {loadingStates[service._id] ? t("adding") : t("add_to_cart")}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>{t("no_services_available")}</p>
                </div>
            )}
        </div>
    );
};

export default ServiceBanner;
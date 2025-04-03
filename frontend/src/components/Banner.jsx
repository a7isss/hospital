import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore"; // Zustand's global state (authStore)
import { toast } from "react-toastify";
import curry from "../assets/curr.svg"; // Placeholder image for currency
import doctorImage2 from "../assets/doc1.png"; // Placeholder image for services
import { useTranslation } from "react-i18next"; // Translation hook

const Banner = () => {
    const {
        services,
        visitorId,
        userData,
        isAuthenticated,
        fetchServices,
    } = useAuthStore((state) => ({
        services: state.services, // Global service list
        visitorId: state.visitorId, // Visitor ID (for unauthenticated users)
        userData: state.userData, // Logged-in user data
        isAuthenticated: state.isAuthenticated, // Authentication status
        fetchServices: state.fetchServices, // Fetch services action
    }));

    const [loadingStates, setLoadingStates] = useState({}); // Tracks button loading state for each service
    const { t } = useTranslation(); // Translation instance

    useEffect(() => {
        if (services.length === 0) {
            fetchServices(); // Fetch services if not already available
        }
    }, [services, fetchServices]);

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true }));

        try {
            if (!visitorId && !userData?.id) {
                toast.error(t("session_not_initialized")); // Show session error if visitorId/userId is missing
                return;
            }

            // Add service to cart using Zustand state or logic
            const cartKey = isAuthenticated
                ? `cart_user_${userData.id}`
                : `cart_visitor_${visitorId}`;

            const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
            const existingService = existingCart.find((item) => item.itemId === service._id);

            let updatedCart;
            if (existingService) {
                existingService.quantity += 1; // Increment quantity if item already exists
                updatedCart = [...existingCart];
            } else {
                updatedCart = [
                    ...existingCart,
                    {
                        itemId: service._id,
                        name: service.name,
                        price: service.price,
                        image: service.image || null,
                        quantity: 1,
                    },
                ];
            }

            const totalPrice = updatedCart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // Save updated cart and total price to localStorage
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            localStorage.setItem(`${cartKey}_totalPrice`, totalPrice.toString());

            toast.success(`${service.name} ${t("added_to_cart")}`); // Show success toast
        } catch (error) {
            console.error("Cart error:", error);
            toast.error(t("cart_error")); // Show error toast
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service._id]: false })); // Reset loading state
        }
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* If services are available, display them */}
            {services && services.length > 0 ? (
                services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col items-stretch shadow hover:shadow-lg transition-shadow"
                    >
                        {/* Service Image */}
                        <div className="w-full flex items-center justify-center bg-gray-100 p-4">
                            <img
                                src={service.image || doctorImage2}
                                alt={service.name}
                                className="w-full h-32 object-contain" // Adjusts to keep the image proportional
                            />
                        </div>

                        {/* Service Details */}
                        <div className="p-4 flex flex-col items-center">
                            {/* Service Name */}
                            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                                {service.name}
                            </h3>

                            {/* Service Price */}
                            <div className="flex items-center text-primary font-semibold text-lg mb-4">
                                {service.price.toFixed(2)}
                                <img
                                    src={curry}
                                    alt="Currency Icon"
                                    className="h-[1.25em] w-[1.25em] ml-1 object-contain"
                                />
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(service)}
                                className={`w-full py-2 text-white font-semibold rounded-lg transition-all ${
                                    loadingStates[service._id]
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-primary hover:bg-primary-dark"
                                }`}
                                disabled={loadingStates[service._id]}
                            >
                                {loadingStates[service._id] ? t("adding") : t("add_to_cart")}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                // Show a message if no services are available
                <div className="col-span-full text-center text-gray-500 text-lg">
                    {t("no_services_available")}
                </div>
            )}
        </div>
    );
};

export default Banner;
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Notifications
import curry from "../assets/curr.svg"; // Currency icon placeholder
import doctorImage2 from "../assets/doc1.png"; // Default placeholder image for services
import useAuthStore from "../store/authStore"; // Zustand's authStore

const ServiceCards = () => {
    // Zustand state
    const {
        isAuthenticated,
        userData,
        services,
        fetchServices,
        loading,
        addToCart,
    } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated, // Track if the user is logged in
        userData: state.userData, // Logged-in user data
        services: state.services, // Global services list
        fetchServices: state.fetchServices, // Fetch services action
        loading: state.loading, // Loading state
        addToCart: state.addToCart, // Add to cart action
    }));

    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each action

    // Fetch services when the component mounts
    useEffect(() => {
        if (!services || services.length === 0) {
            fetchServices(); // Fetch services only if they aren't already fetched
        }
    }, [services, fetchServices]);

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true })); // Set loading state for the service
        try {
            // Ensure the service has a defined price
            if (service.price === undefined) {
                toast.error(`Price for ${service.name} is undefined.`);
                return;
            }

            // Add the service to the cart using the `addToCart` action in authStore
            addToCart(service);

            // Notify success
            toast.success(`${service.name} added to the cart!`);
        } catch (error) {
            // Notify failure
            toast.error(`Failed to add ${service.name} to the cart.`);
            console.error("Error adding service to the cart:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service._id]: false })); // Remove loading for the service
        }
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Show loading state */}
            {loading ? (
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`Loading services...`}</p>
                </div>
            ) : services && services.length > 0 ? (
                // Display services
                services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col items-stretch shadow hover:shadow-lg transition-shadow"
                    >
                        {/* Service image */}
                        <div className="w-full flex items-center justify-center bg-gray-100">
                            <img
                                src={service.image || doctorImage2}
                                alt={service.name}
                                className="w-full object-contain"
                            />
                        </div>

                        {/* Service details */}
                        <div className="p-4 flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                            <p className="text-gray-600 text-sm">
                                {service.description || "No description available."}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <img
                                    className="w-4 h-4"
                                    src={curry}
                                    alt="Currency"
                                />
                                <span className="text-gray-800 font-bold">{`${service.price || 0} USD`}</span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => handleAddToCart(service)}
                            className={`w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-b transition disabled:opacity-50 ${
                                loadingStates[service._id] ? "cursor-not-allowed" : ""
                            }`}
                            disabled={loadingStates[service._id]} // Disable button while loading
                        >
                            {loadingStates[service._id] ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                ))
            ) : (
                // No services available
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`No services available.`}</p>
                </div>
            )}
        </div>
    );
};

export default ServiceCards;
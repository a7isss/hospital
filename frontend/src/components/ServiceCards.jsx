import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Notifications
import curry from "../assets/curr.svg"; // Currency icon placeholder
import doctorImage2 from "../assets/doc1.png"; // Default placeholder image for services
import useAuthStore from "../store/authStore"; // Zustand's authStore

const ServiceCards = () => {
    // Zustand state
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Track if the user is logged in
    const userData = useAuthStore((state) => state.userData); // Logged-in user data
    const services = useAuthStore((state) => state.services); // Global services list
    const fetchServices = useAuthStore((state) => state.fetchServices); // Method to fetch services
    const loading = useAuthStore((state) => state.loading); // Loading state

    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each action

    // Fetch services when the component mounts
    useEffect(() => {
        if (!services || services.length === 0) {
            fetchServices(); // Fetch global services from backend (via Zustand)
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

            // Logic to add the service to the cart
            toast.success(`${service.name} added to the cart!`);
        } catch (error) {
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
            ) : isAuthenticated && userData ? (
                // Display personalized services for the logged-in user
                <div className="col-span-full text-center">
                    <h2 className="text-2xl font-bold">{`Welcome, ${userData.name}`}</h2>
                    <p className="text-gray-700">{`These are your personalized services:`}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {services &&
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
                                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                                            {service.name}
                                        </h3>
                                        <div className="flex items-center text-primary font-semibold text-lg mb-4">
                                            <img
                                                src={curry}
                                                alt="currency"
                                                className="h-5 w-5 mr-1"
                                            />
                                            {service.price}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(service)}
                                            disabled={loadingStates[service._id]} // Disable when adding to the cart
                                            className={`px-4 py-2 rounded-md shadow text-white ${
                                                loadingStates[service._id]
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-primary hover:bg-primary-dark"
                                            }`}
                                        >
                                            {loadingStates[service._id]
                                                ? "Adding..."
                                                : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                // Render default services for unauthenticated users
                services &&
                services.length > 0 && (
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
                                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                                    {service.name}
                                </h3>
                                <div className="flex items-center text-primary font-semibold text-lg mb-4">
                                    <img src={curry} alt="currency" className="h-5 w-5 mr-1" />
                                    {service.price}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(service)}
                                    disabled={loadingStates[service._id]} // Disable during loading
                                    className={`px-4 py-2 rounded-md shadow text-white ${
                                        loadingStates[service._id]
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-primary hover:bg-primary-dark"
                                    }`}
                                >
                                    {loadingStates[service._id] ? "Adding..." : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    ))
                )
            )}
        </div>
    );
};

export default ServiceCards;
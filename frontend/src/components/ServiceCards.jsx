import React, { useState, useEffect } from "react";
import { CartContext } from "../context/CartContext"; // Context for cart operations
import { toast } from "react-toastify"; // Notifications
import curry from "../assets/curr.svg"; // Placeholder for currency icon
import doctorImage2 from "../assets/doc1.png"; // Placeholder image for services
import useAuthStore from "../store/authStore"; // Import Zustand's authStore

const Banner = () => {
    const { addToCart } = CartContext(); // Add to cart functionality from CartContext
    const { services, fetchServices, loading } = useAuthStore(); // Access to services, loading state, and fetchServices from authStore
    const [loadingStates, setLoadingStates] = useState({}); // Tracks loading state for each service

    // Fetch services when the component mounts
    useEffect(() => {
        if (!services || services.length === 0) {
            fetchServices(); // Fetch services from the backend using authStore
        }
    }, [services, fetchServices]);

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true })); // Set loading for the clicked service
        try {
            // Ensure the service has a defined price
            if (service.price === undefined) {
                toast.error(`Price for ${service.name} is undefined.`);
                return;
            }

            // Add the service to the cart with all relevant details
            await addToCart({
                itemId: service._id,
                price: service.price,
                name: service.name,
                image: service.image || null, // Pass image or fallback to null
            });

            // Notify success
            toast.success(`${service.name} added to the cart!`);
        } catch (error) {
            // Notify error
            toast.error(`Failed to add ${service.name} to the cart.`);
            console.error("Error adding service to the cart:", error);
        } finally {
            // Reset loading state for the service
            setLoadingStates((prev) => ({ ...prev, [service._id]: false }));
        }
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Loading State */}
            {loading ? (
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`Loading services...`}</p>
                </div>
            ) : services && services.length > 0 ? (
                // Map through services and render individual service cards
                services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col items-stretch shadow hover:shadow-lg transition-shadow"
                    >
                        {/* Service Image */}
                        <div className="w-full flex items-center justify-center bg-gray-100">
                            <img
                                src={service.image || doctorImage2}
                                alt={service.name}
                                className="w-full object-contain" // Adjusts to keep the image proportional
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
                                <img
                                    src={curry} // Use the imported currency image
                                    alt="Currency Icon"
                                    className="h-[1.25em] w-[1.25em] mr-1 object-contain" // Resize and align to match price font
                                />
                                {service.price !== undefined
                                    ? service.price.toFixed(2)
                                    : "Price Not Available"}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(service)}
                                disabled={!!loadingStates[service._id]} // Disable the button while loading
                                className={`px-4 py-2 rounded-md shadow text-white ${
                                    !!loadingStates[service._id]
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-primary hover:bg-primary-dark"
                                }`}
                            >
                                {/* Show loader if service is being added */}
                                {loadingStates[service._id] ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                // Empty state if no services are available
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`No services available.`}</p>
                </div>
            )}
        </div>
    );
};

export default Banner;
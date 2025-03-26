import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; // Context for global services and data
import { CartContext } from "../context/CartContext"; // Context for cart operations
import { toast } from "react-toastify";
import doctorImage from "../assets/doc6.png"; // Placeholder image for services

const Banner = () => {
    const { services } = useContext(AppContext); // Get services from AppContext
    const { addToCart } = useContext(CartContext); // Add to cart function from CartContext
    const [loadingStates, setLoadingStates] = useState({}); // Tracks loading state for each service

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true })); // Set loading for the clicked service
        try {
            // Add the service to the cart (only sending the itemId)
            await addToCart({ itemId: service._id });

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
            {/* If services are available, display them */}
            {services && services.length > 0 ? (
                services.map((service) => (
                    <div
                        key={service._id}
                        className="service-card border-2 border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
                    >
                        {/* Service Image */}
                        <img
                            src={doctorImage}
                            alt={service.name}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />

                        {/* Service Details */}
                        <div className="p-4 flex flex-col items-start">
                            <h3 className="font-bold text-lg text-gray-700">{service.name}</h3>
                            <p className="mt-2 text-gray-500 text-sm">Price: ₹{service.price}</p>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(service)}
                                className={`mt-4 px-4 py-2 rounded-md text-white font-semibold ${
                                    loadingStates[service._id]
                                        ? "bg-gray-400 cursor-not-allowed animate-pulse"
                                        : "bg-blue-500 hover:bg-blue-700 transition-colors"
                                }`}
                                disabled={loadingStates[service._id]} // Disable button while loading
                            >
                                {loadingStates[service._id] ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No services available.</p> // Fallback for no services
            )}
        </div>
    );
};

export default Banner;
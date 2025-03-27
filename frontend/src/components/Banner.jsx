import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; // Context for global services and data
import { CartContext } from "../context/CartContext"; // Context for cart operations
import { toast } from "react-toastify";
import doctorImage1 from "../assets/doc6.png"; // Placeholder image for services
import doctorImage2 from "../assets/doc1.png"; // Placeholder image for services
import doctorImage3 from "../assets/doc2.png"; // Placeholder image for services
import doctorImage4 from "../assets/doc3.png.png"; // Placeholder image for services
import doctorImage5 from "../assets/doc4.png"; // Placeholder image for services
import curry from "../assets/curr.svg"; // Placeholder image for services

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
                                    className="h-[1.25em] w-[1.25em] mr-1 object-contain" // Presizes and aligns to match price font
                                />
                                {service.price.toFixed(2)}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(service)}
                                className={`w-full bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary-dark transition 
                                ${loadingStates[service._id] && "opacity-50 cursor-not-allowed"}`}
                                disabled={loadingStates[service._id]} // Disable button while loading
                            >
                                {loadingStates[service._id] ? (
                                    <span className="loader border-t-white w-5 h-5"></span> // Spinner/Loader when loading
                                ) : (
                                    "Add to Cart" // Button text when not loading
                                )}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No services available.</p>
            )}
        </div>
    );
};

export default Banner;
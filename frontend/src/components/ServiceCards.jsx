import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import currIcon from "../assets/curr.svg";

const ServiceCards = ({ services }) => {
    const { cart, addToCart } = useContext(CartContext); // Access the cart and addToCart function
    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each service

    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service._id]: true })); // Set loading for the clicked service
        try {
            // Add all relevant service details to the cart
            await addToCart({
                itemId: service._id,
                price: service.price,
                name: service.name,
                image: service.image || null, // Pass image or null as fallback
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {services.map((service) => (
                <div
                    key={service._id}
                    className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col items-stretch shadow hover:shadow-lg transition-shadow"
                >
                    {/* Service Image */}
                    <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
                        <img
                            src={service.image || "https://via.placeholder.com/150"}
                            alt={service.name}
                            className="w-full object-contain h-full"
                        />
                    </div>

                    {/* Service Details */}
                    <div className="p-4 flex flex-col items-center">
                        {/* Service Name */}
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                            {service.name}
                        </h3>

                        {/* Service Price */}
                        <p className="text-primary font-semibold text-lg mb-4 flex items-center gap-1">
                            <img
                                src={currIcon}
                                alt="Currency Icon"
                                className="h-[1em] w-auto object-contain"
                            />
                            {service.price.toFixed(2)}
                        </p>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => handleAddToCart(service)}
                            className={`w-full bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary-dark transition 
                                ${loadingStates[service._id] && "opacity-50 cursor-not-allowed"}`}
                            disabled={loadingStates[service._id]} // Disable button while loading
                        >
                            {loadingStates[service._id] ? (
                                <span className="loader border-t-white w-5 h-5"></span> // Spinner/Loader
                            ) : (
                                "Add to Cart"
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceCards;
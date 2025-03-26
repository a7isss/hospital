import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

const ServiceCards = ({ services }) => {
    const { addToCart } = useContext(CartContext); // Access addToCart method from CartContext
    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each card

    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service.id]: true })); // Start loading for the current service
        try {
            await addToCart({
                itemId: service.id,
                name: service.name,
                price: service.price,
                quantity: 1, // Default to 1 when adding to the cart
            });
        } catch (error) {
            console.error("Error adding item to cart:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service.id]: false })); // Stop loading
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="border border-gray-300 shadow-md rounded-lg p-4 flex flex-col items-center"
                >
                    <img
                        src={service.image || "https://via.placeholder.com/150"}
                        alt={service.name}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                        {service.name}
                    </h3>
                    <p className="text-primary font-semibold text-lg mb-4">
                        ₹{service.price.toFixed(2)}
                    </p>
                    <button
                        onClick={() => handleAddToCart(service)}
                        className={`bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition ${
                            loadingStates[service.id] && "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={loadingStates[service.id]} // Disable button while loading
                    >
                        {loadingStates[service.id] ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ServiceCards;
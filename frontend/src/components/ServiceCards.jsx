import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import currIcon from "../assets/curr.svg"; // Import the currency SVG

const ServiceCards = ({ services }) => {
    const { addToCart, cart } = useContext(CartContext); // Access addToCart and cart state from CartContext
    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each card

    const handleAddToCart = async (service) => {
        setLoadingStates((prev) => ({ ...prev, [service.id]: true })); // Start loading for the current service
        try {
            // Check if item already exists in the cart
            const existingItem = cart.find((item) => item.itemId === service.id);
            const quantity = existingItem ? existingItem.quantity + 1 : 1;

            await addToCart({
                itemId: service.id,
                name: service.name,
                price: service.price,
                quantity,
            });

            toast.success(`${service.name} added to cart!`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error(`Failed to add ${service.name} to cart.`);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [service.id]: false })); // Stop loading
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="border border-gray-200 shadow-md rounded-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                    {/* Service Image */}
                    <img
                        src={service.image || "https://via.placeholder.com/150"}
                        alt={service.name}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />

                    {/* Service Name */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                        {service.name}
                    </h3>

                    {/* Service Price */}
                    <p className="text-primary font-semibold text-lg mb-4 flex items-center gap-1">
                        <img
                            src={currIcon}
                            alt="Currency Icon"
                            className="h-[1em] w-auto object-contain" // Matches the height of the text
                        />
                        {service.price.toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => handleAddToCart(service)}
                        className={`flex items-center justify-center w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition 
                            ${loadingStates[service.id] && "opacity-50 cursor-not-allowed"}`}
                        disabled={loadingStates[service.id]} // Disable button while loading
                    >
                        {loadingStates[service.id] ? (
                            <span className="loader border-t-white w-5 h-5"></span> // Added a spinner style loader
                        ) : (
                            "Add to Cart"
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ServiceCards;
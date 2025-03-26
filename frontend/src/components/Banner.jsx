import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; // Context for fetching services
import { CartContext } from "../context/CartContext"; // Context for cart operations
import { toast } from "react-toastify"; // Toast notifications for user feedback

const Banner = () => {
    const { services } = useContext(AppContext); // Fetch the list of services from the context
    const { addToCart } = useContext(CartContext); // Use addToCart function from CartContext
    const [rotatingId, setRotatingId] = useState(null); // Track which button is rotating

    // Handles adding an item to the cart
    const handleAddToCart = async (service) => {
        try {
            // Prepare the cart item structure
            const cartItem = {
                serviceId: service._id, // Service ID
                name: service.name, // Service Name
                price: service.price, // Service Price
                quantity: 1, // Default quantity to add
            };

            // Add the item to the cart via the context method
            await addToCart(cartItem);

            // Show a success notification
            toast.success(`${service.name} added to your cart!`);

            // Animate the button to give feedback
            setRotatingId(service._id);
            setTimeout(() => setRotatingId(null), 500); // Reset rotation
        } catch (error) {
            // Handle errors by showing a toast notification
            toast.error("Failed to add the item to the cart. Try again.");
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="banner-container">
            <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service._id} // Unique key for each service
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
                    >
                        {/* Service details */}
                        <h3 className="text-xl font-bold">{service.name}</h3>
                        <p className="text-gray-600">₹{service.price}</p>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => handleAddToCart(service)} // Click handler for adding to cart
                            className={`mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-transform duration-500 ${
                                rotatingId === service._id ? "rotate-360" : "" // Rotation feedback
                            }`}
                        >
                            {rotatingId === service._id ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
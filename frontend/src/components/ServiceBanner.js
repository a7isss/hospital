import React, { useState } from "react";
import useAuthStore from "../store/authStore"; // Zustand authStore for global state
import { toast } from "react-toastify";

const Banner = () => {
    // Access services and cart-related actions from authStore
    const services = useAuthStore((state) => state.services);
    const addToCart = useAuthStore((state) => state.addToCart);
    const [rotatingId, setRotatingId] = useState(null);

    // Handle adding a service to the cart
    const handleAddToCart = (service) => {
        try {
            // Prepare the item details for the cart
            const cartItem = {
                itemId: service._id,
                name: service.name,
                price: service.price,
                quantity: 1,
            };

            // Add the item to the cart via authStore
            addToCart(cartItem);
            toast.success(`${service.name} added to your cart!`);

            // Handle animation for "Adding..." feedback
            setRotatingId(service._id);
            setTimeout(() => setRotatingId(null), 500);
        } catch (error) {
            toast.error("Failed to add item to cart!");
            console.error("Error while adding to cart:", error);
        }
    };

    return (
        <div className="banner-container">
            <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Render each service */}
                {services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
                    >
                        {/* Service details */}
                        <h3 className="text-xl font-bold">{service.name}</h3>
                        <p className="text-gray-600">₹{service.price}</p>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => handleAddToCart(service)}
                            className={`mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-transform ${
                                rotatingId === service._id ? "rotate-360" : ""
                            }`}
                            disabled={rotatingId === service._id} // Disable button if already adding
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
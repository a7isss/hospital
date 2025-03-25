import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; // For services
import { CartContext } from "../context/CartContext"; // For cart operations
import { toast } from "react-toastify";

const Banner = () => {
    const { services } = useContext(AppContext); // Get services from AppContext
    const { addToCart } = useContext(CartContext); // Get addToCart function from CartContext
    const [rotatingId, setRotatingId] = useState(null); // Track which button is rotating

    const handleAddToCart = (service) => {
        const cartItem = {
            itemId: service._id, // Service ID
            name: service.name, // Service Name
            price: service.price, // Service Price
            quantity: 1, // Default quantity
        };

        addToCart(cartItem); // Add to cart (handled for both visitors and logged-in users)
        toast.success(`${service.name} added to cart!`); // Show success message

        setRotatingId(service._id); // Set the button to rotate
        setTimeout(() => setRotatingId(null), 500); // Reset rotation after 500ms
    };

    return (
        <div className="banner-container">
            <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
                    >
                        <h3 className="text-xl font-bold">{service.name}</h3>
                        <p className="text-gray-600">₹{service.price}</p>
                        <button
                            onClick={() => handleAddToCart(service)}
                            className={`mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-transform duration-500 ${
                                rotatingId === service._id ? "rotate-360" : ""
                            }`}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; // Context for services
import { CartContext } from "../context/CartContext"; // Context for cart
import { toast } from "react-toastify";
import doctorImage from "../assets/doc6.png"; // Use the image for cards

const Banner = () => {
    const { services } = useContext(AppContext); // Access services from AppContext
    const { addToCart, fetchCart } = useContext(CartContext); // Access addToCart and fetchCart from CartContext
    const [rotatingId, setRotatingId] = useState(null);

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        try {
            // Lazily fetch the cart before adding an item, ensures the cart is loaded once
            await fetchCart();

            const cartItem = {
                serviceId: service._id,
                name: service.name,
                price: service.price,
                quantity: 1,
            };

            // Use the addToCart function from CartContext
            await addToCart(cartItem);
            toast.success(`${service.name} added to your cart!`);
            setRotatingId(service._id);
            setTimeout(() => setRotatingId(null), 500);
        } catch (error) {
            toast.error("Failed to add to cart.");
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Check if services are available */}
            {services && services.length > 0 ? (
                services.map((service) => (
                    <div
                        key={service._id}
                        className="service-card border-2 border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
                    >
                        <img
                            src={doctorImage}
                            alt={service.name}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="p-4 flex flex-col items-start">
                            <h3 className="font-bold text-lg text-gray-700">{service.name}</h3>
                            <p className="mt-2 text-gray-500 text-sm">Price: ₹{service.price}</p>
                            <button
                                onClick={() => handleAddToCart(service)}
                                className={`mt-4 px-4 py-2 rounded-md text-white font-semibold ${
                                    rotatingId === service._id
                                        ? "bg-gray-400 cursor-not-allowed animate-pulse"
                                        : "bg-blue-500 hover:bg-blue-700 transition-colors"
                                }`}
                                disabled={rotatingId === service._id}
                            >
                                {rotatingId === service._id ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No services available</p>
            )}
        </div>
    );
};

export default Banner;
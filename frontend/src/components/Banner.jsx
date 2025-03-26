import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; // Context for services
import { CartContext } from "../context/CartContext"; // Context for cart
import { toast } from "react-toastify";

const Banner = () => {
    const { services } = useContext(AppContext); // Access services from AppContext
    const { cart, addToCart } = useContext(CartContext); // Access cart and addToCart function from CartContext
    const [rotatingId, setRotatingId] = useState(null);

    // Debugging to check cart and services context
    console.log("Cart:", cart);
    console.log("Services:", services);

    // Handles adding a service to the cart
    const handleAddToCart = async (service) => {
        try {
            const cartItem = {
                serviceId: service._id,
                name: service.name,
                price: service.price,
                quantity: 1,
            };

            await addToCart(cartItem); // Use `addToCart` from the CartContext
            toast.success(`${service.name} added to your cart!`);
            setRotatingId(service._id);
            setTimeout(() => setRotatingId(null), 500);
        } catch (error) {
            toast.error("Failed to add to cart.");
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="banner-container">
            {services && services.length > 0 ? (
                services.map((service) => (
                    <div key={service._id} className="service-card">
                        <h3>{service.name}</h3>
                        <p>₹{service.price}</p>
                        <button
                            onClick={() => handleAddToCart(service)}
                            className={`rotate-button ${
                                rotatingId === service._id ? "rotating" : ""
                            }`}
                        >
                            {rotatingId === service._id ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                ))
            ) : (
                <p>No services available.</p>
            )}
        </div>
    );
};

export default Banner;
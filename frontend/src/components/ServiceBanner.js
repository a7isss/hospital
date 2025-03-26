import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const Banner = () => {
    const { services } = useContext(AppContext);
    const { addToCart } = useContext(CartContext);
    const [rotatingId, setRotatingId] = useState(null);

    const handleAddToCart = async (service) => {
        try {
            const cartItem = {
                serviceId: service._id,
                name: service.name,
                price: service.price,
                quantity: 1,
            };
            await addToCart(cartItem);
            toast.success(`${service.name} added to your cart!`);

            setRotatingId(service._id);
            setTimeout(() => setRotatingId(null), 500);
        } catch (error) {
            toast.error("Failed to add item to cart!");
            console.error("Error:", error);
        }
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
                            className={`mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-transform ${
                                rotatingId === service._id ? "rotate-360" : ""
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
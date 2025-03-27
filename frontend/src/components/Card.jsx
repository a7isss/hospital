import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import currIcon from "../assets/curr.svg";

const Card = ({ service }) => {
    const { addToCart } = useContext(CartContext); // Access the addToCart function
    const [loading, setLoading] = useState(false); // Track loading state for the service

    const handleAddToCart = async () => {
        setLoading(true); // Set loading state
        try {
            // Ensure the service has a defined price
            if (service.price === undefined) {
                toast.error(`Price for ${service.name} is undefined.`);
                return;
            }

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
            // Reset loading state
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-white border border-gray-300 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
            {/* Service Image */}
            <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
                <img
                    src={service.image || "https://via.placeholder.com/150"} // Use the image link from Cloudinary
                    alt={service.name}
                    className="w-full object-contain h-full"
                />
            </div>

            {/* Transparent White Area with Service Details */}
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-4 flex flex-col items-center rounded-b-lg">
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
                    {service.price !== undefined ? service.price.toFixed(2) : "Price Not Available"}
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className={`w-full bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary-dark transition 
                        ${loading && "opacity-50 cursor-not-allowed"}`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <span className="loader border-t-white w-5 h-5"></span> // Spinner/Loader
                    ) : (
                        "Add to Cart"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Card;

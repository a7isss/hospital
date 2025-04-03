import React, { useState } from "react";
import useAuthStore from "../store/authStore"; // Zustand's global state (authStore)
import { toast } from "react-toastify";
import currIcon from "../assets/curr.svg";

const Card = ({ service }) => {
    const {
        isAuthenticated,
        visitorId,
        userData,
        currencySymbol,
    } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated, // Authentication status
        visitorId: state.visitorId, // Visitor ID (for unauthenticated users)
        userData: state.userData, // User data for authenticated users
        currencySymbol: state.currencySymbol || "₹", // Default to ₹ if not set
    }));

    const [loading, setLoading] = useState(false); // Track loading state for the service

    const handleAddToCart = async () => {
        setLoading(true); // Set loading state
        try {
            // Ensure the service has a defined price
            if (service.price === undefined) {
                toast.error(`Price for ${service.name} is undefined.`);
                return;
            }

            // Determine the cart key (user-specific or visitor-specific)
            const cartKey = isAuthenticated
                ? `cart_user_${userData?.id}`
                : `cart_visitor_${visitorId}`;

            // Load the existing cart from localStorage
            const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
            const existingService = existingCart.find((item) => item.itemId === service._id);

            // Update cart with the service item
            let updatedCart;
            if (existingService) {
                existingService.quantity += 1; // Increment quantity if item already exists
                updatedCart = [...existingCart];
            } else {
                updatedCart = [
                    ...existingCart,
                    {
                        itemId: service._id,
                        name: service.name,
                        price: service.price,
                        image: service.image || null, // Pass image or null as fallback
                        quantity: 1,
                    },
                ];
            }

            // Calculate updated total price
            const totalPrice = updatedCart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // Save updated cart and total price to localStorage
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            localStorage.setItem(`${cartKey}_totalPrice`, totalPrice.toString());

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
                    src={service.image || "https://via.placeholder.com/150"}
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
                    {service.price !== undefined
                        ? `${currencySymbol}${service.price.toFixed(2)}`
                        : "Price Not Available"}
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className={`w-full bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary-dark transition 
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <span className="loader border-t-white w-5 h-5 rounded-full border-2 border-gray-400 animate-spin"></span>
                    ) : (
                        "Add to Cart"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Card;
import React, { useEffect, useState } from "react";
import useVisitorStore from "../store/visitorStore"; // Import visitorStore for default behavior
import useAuthStore from "../store/authStore"; // Import authStore for authenticated users
import { toast } from "react-toastify";
import doctorImage2 from "../assets/doc1.png";

const ServiceCards = () => {
    const [services, setServices] = useState([]); // Local state to unify services display
    const [loading, setLoading] = useState(false); // Load indicator for both visitor and auth flows
    const [error, setError] = useState(null); // Error handling

    const { visitorId, generateVisitorId, fetchServices: fetchVisitorServices } = useVisitorStore();
    const { isAuthenticated, fetchServices: fetchAuthServices } = useAuthStore();

    // Fetch services from the appropriate store depending on the user's state
    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isAuthenticated) {
                console.log("Fetching services for authenticated user...");
                const fetchedServices = await fetchAuthServices(); // Fetch authStore services
                setServices(fetchedServices);
            } else {
                console.log("Fetching services for visitor...");
                generateVisitorId(); // Ensure visitorId exists for unauthenticated requests
                const fetchedServices = await fetchVisitorServices();
                setServices(fetchedServices);
            }
        } catch (err) {
            console.error("Error fetching services:", err.message);
            toast.error("Failed to fetch services. Please try again later.");
            setError("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch services when the component mounts or authentication state changes
    useEffect(() => {
        fetchServices();
    }, [isAuthenticated]); // Re-fetch if the user logs in or out

    const handleAddToCart = (service) => {
        console.log(
            isAuthenticated
                ? `Adding service to authenticated user's cart: ${service.name}`
                : `Adding service to visitor's cart with ID ${visitorId}: ${service.name}`
        );
        toast.success(`${service.name} added to the cart!`);
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {loading ? (
                <div className="text-center col-span-full">
                    <p className="text-gray-500">Loading services...</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 col-span-full">{error}</div>
            ) : services.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full">
                    No services available at the moment.
                </div>
            ) : (
                services.map((service) => (
                    <div
                        key={service._id?.$oid || service._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="w-full flex items-center justify-center bg-gray-100">
                            <img
                                src={service.image || doctorImage2}
                                alt={service.name}
                                className="w-full object-contain"
                            />
                        </div>
                        <div className="p-4 flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-primary text-xl font-semibold">
                                    {service.price} EGP
                                </span>
                                <button
                                    onClick={() => handleAddToCart(service)}
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ServiceCards;
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import { toast } from "react-toastify"; // Notifications
import doctorImage2 from "../assets/doc1.png"; // Placeholder image for services

const ServiceCards = () => {
    const [services, setServices] = useState([]); // State to store services
    const [loading, setLoading] = useState(false); // Loading state

    // Function to fetch services from the server
    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/visitor/services"); // Call the unprotected route
            setServices(response.data); // Store services in state
        } catch (error) {
            console.error("Error fetching services:", error.message);
            toast.error("Failed to fetch services. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Fetch services on component mount
    useEffect(() => {
        fetchServices();
    }, []);

    // Handles adding a service to the cart
    const handleAddToCart = (service) => {
        toast.success(`${service.name} added to the cart!`);
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Show loading state */}
            {loading ? (
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`Loading services...`}</p>
                </div>
            ) : services && services.length > 0 ? (
                // Display services
                services.map((service) => (
                    <div
                        key={service._id?.$oid || service._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col items-stretch shadow hover:shadow-lg transition-shadow"
                    >
                        {/* Service image */}
                        <div className="w-full flex items-center justify-center bg-gray-100">
                            <img
                                src={service.image || doctorImage2}
                                alt={service.name}
                                className="w-full object-contain"
                            />
                        </div>

                        {/* Service details */}
                        <div className="p-4 flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-800 text-center">
                                {service.name}
                            </h3>
                            <p className="text-gray-600 text-sm text-center">
                                {service.description || "No description available."}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-primary text-xl font-semibold">
                                    {service.price} EGP
                                </span>
                                <button
                                    onClick={() => handleAddToCart(service)}
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`No services available.`}</p>
                </div>
            )}
        </div>
    );
};

export default ServiceCards;
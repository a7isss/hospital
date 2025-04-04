import React, { useEffect, useState } from "react";
import axios from "axios"; // For unprotected API requests
import useVisitorStore from "../store/visitorStore"; // Import the visitor store
import { toast } from "react-toastify";
import doctorImage2 from "../assets/doc1.png";

const ServiceCards = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const { visitorId, generateVisitorId } = useVisitorStore(); // Access visitor ID and generator from store

    useEffect(() => {
        // Ensure visitor ID exists
        generateVisitorId();

        // Fetch services after ensuring visitor ID
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/visitor/services"); // Unprotected endpoint
                setServices(response.data); // Populate services
            } catch (error) {
                console.error("Error fetching services:", error.message);
                toast.error("Failed to fetch services. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [generateVisitorId]);

    const handleAddToCart = (service) => {
        console.log("Adding service to cart for visitor:", visitorId);
        toast.success(`${service.name} added to the cart!`);
    };

    return (
        <div className="banner-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {loading ? (
                <div className="text-center col-span-full">
                    <p className="text-gray-500">{`Loading services...`}</p>
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
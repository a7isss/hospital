import React, { useEffect } from "react";
import { toast } from "react-toastify";
import useVisitorStore from "../store/visitorStore"; // Import visitorStore
import doctorImage2 from "../assets/doc1.png"; // Fallback image

const ServiceCards = () => {
    // Subscribe to visitorStore's state and actions
    const { services, fetchServices, loading, error } = useVisitorStore();

    // Fetch services when the component mounts
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleAddToCart = (service) => {
        console.log(`Adding service to cart: ${service.name}`);
        toast.success(`${service.name} added to the cart!`);
    };

    // Render services
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
                        key={service._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="w-full flex items-center justify-center bg-gray-100">
                            <img
                                src={service.image || doctorImage2} // Use service image or fallback
                                alt={service.name}
                                className="w-full object-contain"
                            />
                        </div>
                        <div className="p-4 flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                            <p className="text-gray-900 font-bold mt-2">Price: ₹{service.price}</p>
                            <button
                                onClick={() => handleAddToCart(service)}
                                className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ServiceCards;
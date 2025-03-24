import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext'; // Import AdminContext

const ServicesList = () => {
    const { getAllServices } = useContext(AdminContext); // Access getAllServices from AdminContext
    const [services, setServices] = useState([]); // State for fetched services
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch services when the component mounts
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true); // Start loading
                const fetchedServices = await getAllServices(); // Fetch services from context
                console.log('Fetched services:', fetchedServices); // Debugging response
                if (fetchedServices) {
                    setServices(fetchedServices); // Save services state
                }
            } catch (err) {
                console.error('Error fetching services:', err); // For debugging
                setError('Failed to load services. Please try again later.');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchServices();
    }, [getAllServices]); // Dependency array includes getAllServices to prevent unintended reloads

    // Return statement for rendering
    return (
        <div className="m-5 h-auto overflow-visible">
            <h1 className="text-lg font-medium">All Services</h1>

            {loading ? (
                <p className="text-gray-500 mt-4">Loading services...</p>
            ) : error ? (
                <p className="text-red-500 mt-4">{error}</p>
            ) : services?.length > 0 ? (
                <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                    console.log('Rendered services:', services);
                    {services.map((service) => {
                        // Destructure fields for cleaner and safe rendering
                        const {
                            _id,
                            image = '/default-service.png', // Default image fallback
                            name = 'Unknown Service',
                            description = 'No description available',
                            category = 'N/A',
                            price = 'N/A',
                            duration = 'N/A',
                            available,
                        } = service;

                        return (
                            <div
                                key={_id}
                                className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                            >
                                {/* Image */}
                                <img
                                    className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
                                    src={image}
                                    alt={name}
                                />

                                {/* Service Details */}
                                <div className="p-4">
                                    <p className="text-[#262626] text-lg font-medium">{name}</p>
                                    <p className="text-[#5C5C5C] text-sm">{description}</p>
                                    <p className="text-sm mt-2">Category: {category}</p>
                                    <p className="text-sm mt-1 font-medium">Price: ${price} | Duration: {duration}</p>

                                    {/* Availability */}
                                    {available !== undefined && (
                                        <p className={`mt-2 ${available ? 'text-green-600' : 'text-red-600'}`}>
                                            {available ? 'Available' : 'Unavailable'}

                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No services available at the moment.</p>
            )}
        </div>
    );
};

export default ServicesList;
import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext'; // Import AdminContext

const ServicesList = () => {
    const { getAllServices } = useContext(AdminContext);
    const [services, setServices] = useState([]); // State for fetched services
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch services when component mounts
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true); // Start loading
                const fetchedServices = await getAllServices(); // Fetch services using context
                console.log('Fetched services:', fetchedServices); // Debug print
                if (Array.isArray(fetchedServices)) {
                    setServices(fetchedServices); // Set state with fetched services
                } else {
                    console.error('Unexpected data format:', fetchedServices); // Debugging
                    setError('Unexpected data received. Could not fetch services.');
                }
            } catch (err) {
                console.error('Error fetching services:', err); // Debugging
                setError('Failed to load services. Please try again later.');
            } finally {
                setLoading(false); // Stop the loader
            }
        };

        fetchServices();
    }, [getAllServices]);

    return (
        <div className="m-5 h-auto overflow-visible">
            <h1 className="text-lg font-medium mb-4">All Services</h1>

            {loading ? (
                <p className="text-gray-500 mt-4">Loading services...</p>
            ) : error ? (
                <p className="text-red-500 mt-4">{error}</p>
            ) : services.length > 0 ? (
                <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                    {services.map((service) => {
                        const {
                            _id,
                            image = '/default-service.png', // Use fallback if image is undefined
                            name = 'Unknown Service',
                            description = 'No description available',
                            category = 'N/A',
                            price = 'N/A',
                            duration = 'N/A',
                            available,
                        } = service;

                        // Validate and ensure `_id` exists before rendering
                        if (!_id) return null;

                        return (
                            <div
                                key={_id}
                                className="border border-[#C9D8FF] rounded-xl w-64 overflow-hidden cursor-pointer group bg-white"
                            >
                                {/* Service Image */}
                                <img
                                    src={image}
                                    alt={name}
                                    onError={(e) => {
                                        e.target.src = '/default-service.png'; // Fallback if image fails to load
                                    }}
                                    className="w-full h-36 object-cover group-hover:scale-105 transition-all duration-500"
                                />

                                {/* Service Details */}
                                <div className="p-4">
                                    <p className="text-[#262626] text-lg font-medium">{name}</p>
                                    <p className="text-[#5C5C5C] text-sm mt-2">
                                        {description || 'No description available'}
                                    </p>
                                    <p className="text-sm mt-2">
                                        <span className="font-bold">Category:</span> {category}
                                    </p>
                                    <p className="text-sm mt-1 font-medium">
                                        <span className="font-bold">Price:</span>{' '}
                                        {price !== 'N/A' ? `$${price}` : price}{' '}
                                        | <span className="font-bold">Duration:</span> {duration}
                                    </p>

                                    {/* Availability */}
                                    {available !== undefined && (
                                        <p
                                            className={`mt-2 font-bold ${
                                                available ? 'text-green-600' : 'text-red-600'
                                            }`}
                                        >
                                            {available ? 'Available' : 'Unavailable'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No services found.</p>
            )}
        </div>
    );
};

export default ServicesList;
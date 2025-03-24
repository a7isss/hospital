import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const ServicesList = () => {
    const { getAllServices } = useContext(AdminContext); // Fetch function from context
    const [services, setServices] = useState([]); // State for storing fetched services
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true); // Start loading
                const fetchedServices = await getAllServices(); // Fetch services from context function
                if (Array.isArray(fetchedServices)) {
                    setServices(fetchedServices); // Store services in state
                } else {
                    setError('Unexpected data received. Could not fetch services.');
                }
            } catch (err) {
                console.error(err); // For debugging
                setError('Failed to load services. Please try again later.');
            } finally {
                setLoading(false); // Stop loading once fetch is complete
            }
        };

        fetchServices(); // Call fetch function on component mount
    }, [getAllServices]);

    const truncateText = (text = '', maxLength = 100) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Services</h1>
            {loading ? (
                <p className="text-gray-500 mt-4">Loading services...</p>
            ) : error ? (
                <p className="text-red-500 mt-4">{error}</p>
            ) : services.length > 0 ? (
                <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                    {services.map((service) => {
                        // Destructure and provide fallbacks for potential missing fields
                        const {
                            _id,
                            image = '/default-service.png', // Default fallback image
                            name = 'Unknown Service', // Default service name
                            description = 'No description available', // Fallback for missing description
                            category = 'N/A', // Category default
                            price = 'N/A', // Fallback for missing price
                            duration = 'N/A', // Fallback for service duration
                            available = false, // Assume unavailable if not specified
                        } = service;

                        return (
                            <div
                                className="border border-[#C9D8FF] rounded-xl max-w-[14rem] overflow-hidden cursor-pointer group transition-transform transform hover:scale-105"
                                key={_id || Math.random()} // Use _id for key (fallback to Math.random if _id is missing)
                            >
                                {/* Service Image */}
                                <img
                                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                                    src={image}
                                    alt={name}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = '/default-service.png'; // Replace broken images
                                    }}
                                />

                                {/* Service Details */}
                                <div className="p-4">
                                    <p className="text-[#262626] text-lg font-medium">{name}</p>
                                    <p className="text-[#5C5C5C] text-sm">{truncateText(description)}</p>
                                    <p className="text-sm mt-2">
                                        <span className="font-bold">Category:</span> {category}
                                    </p>
                                    <p className="text-sm mt-1 font-medium">
                                        <span className="font-bold">Price:</span>{' '}
                                        {price !== 'N/A' ? `$${price}` : price}{' '}
                                        | <span className="font-bold">Duration:</span> {duration}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={available}
                                            readOnly
                                            className="cursor-default"
                                        />
                                        <p>{available ? 'Available' : 'Unavailable'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No services available.</p>
            )}
        </div>
    );
};

export default ServicesList;
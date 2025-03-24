import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const ServicesList = () => {
    const { getAllServices } = useContext(AdminContext); // Fetch function from context
    const [services, setServices] = useState([]); // Local state for service data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch services on component mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true); // Ensure loading starts
                const fetchedServices = await getAllServices(); // Call service fetch function
                console.log('Fetched services:', fetchedServices); // Debug fetched data
                if (Array.isArray(fetchedServices)) {
                    setServices(fetchedServices); // Store fetched services in state
                } else {
                    console.error('Unexpected data format:', fetchedServices); // Debug invalid data
                    setError('Unexpected data received. Could not fetch services.');
                }
            } catch (err) {
                console.error('Error fetching services:', err); // Log fetch errors
                setError('Failed to load services. Please try again later.');
            } finally {
                setLoading(false); // Stop loading when fetch completes
            }
        };

        fetchServices();
    }, [getAllServices]); // Dependency on fetch function

    // Render the component
    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Services</h1>
            {loading ? (
                <p className="text-gray-500 mt-4">Loading services...</p>
            ) : error ? (
                <p className="text-red-500 mt-4">{error}</p>
            ) : services.length > 0 ? (
                <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                    {services.map((service, index) => {
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
                                className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                                key={index} // Key based on index, as fallback if `_id` is unreliable
                            >
                                {/* Service Image */}
                                <img
                                    className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
                                    src={image}
                                    alt={name}
                                    onError={(e) => {
                                        e.target.src = '/default-service.png'; // Fallback if image fails to load
                                    }}
                                />

                                {/* Service Details */}
                                <div className="p-4">
                                    <p className="text-[#262626] text-lg font-medium">{name}</p>
                                    <p className="text-[#5C5C5C] text-sm">{description}</p>
                                    <p className="text-sm mt-2">
                                        <span className="font-bold">Category:</span> {category}
                                    </p>
                                    <p className="text-sm mt-1 font-medium">
                                        <span className="font-bold">Price:</span>{' '}
                                        {price !== 'N/A' ? `$${price}` : price}{' '}
                                        | <span className="font-bold">Duration:</span> {duration}
                                    </p>
                                    {/* Availability */}
                                    <div className="mt-2 flex items-center gap-1 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={available}
                                            disabled
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
                <p className="text-gray-500 mt-4">No services found.</p>
            )}
        </div>
    );
};

export default ServicesList;
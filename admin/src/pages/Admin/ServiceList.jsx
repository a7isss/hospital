import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext'; // Import AdminContext

const ServicesList = () => {
    const { getAllServices } = useContext(AdminContext); // Access getAllServices from AdminContext
    const [services, setServices] = useState([]); // State to hold the fetched services
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch services using the context method
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const fetchedServices = await getAllServices(); // Call getAllServices from AdminContext
                if (fetchedServices) {
                    setServices(fetchedServices); // Assign fetched services to state
                }
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Failed to load services. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Services</h1>

            {loading ? (
                <p className="text-gray-500 mt-4">Loading services...</p>
            ) : error ? (
                <p className="text-red-500 mt-4">{error}</p>
            ) : services?.length > 0 ? (
                <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                    {services.map((service) => (
                        <div
                            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                            key={service._id}
                        >
                            <img
                                className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
                                src={service.image || '/default-service.png'}
                                alt={service.name || 'Service'}
                            />
                            <div className="p-4">
                                <p className="text-[#262626] text-lg font-medium">{service.name || 'Unknown Service'}</p>
                                <p className="text-[#5C5C5C] text-sm">{service.description || 'No description available'}</p>
                                <p className="text-sm mt-2">Category: {service.category || 'N/A'}</p>
                                <p className="text-sm mt-1 font-medium">
                                    Price: ${service.price || 'N/A'} | Duration: {service.duration || 'N/A'}
                                </p>
                                {service.available !== undefined && (
                                    <p
                                        className={`mt-2 ${
                                            service.available ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {service.available ? 'Available' : 'Unavailable'}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No services available right now.</p>
            )}
        </div>
    );
};

export default ServicesList;
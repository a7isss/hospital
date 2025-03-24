import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const [services, setServices] = useState([]); // Local state for services
    const [error, setError] = useState(null); // Handle errors
    const { t } = useTranslation(); // Initialize translation

    // Fetch services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/uservices`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Services fetched in Banner:", data); // Debugging
                if (data.success) {
                    setServices(data.services); // Update local state with services
                } else {
                    setError(data.message || "Failed to fetch services");
                }
            } catch (err) {
                console.error("Error fetching services:", err.message);
                setError("An error occurred while fetching services");
            }
        };

        fetchServices();
    }, []); // Run on component mount only

    return (
        <div className='flex flex-col bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
            <div className='py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 text-center'>
                <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    {t('book_appointment')} {/* Preserving existing title */}
                </h2>
            </div>

            {/* ------- Services Listing ------- */}
            <div className='services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {error ? (
                    // Render error if fetching fails
                    <div className="text-red-500 text-center col-span-full">
                        {error}
                    </div>
                ) : services.length > 0 ? (
                    // Render services (if successfully fetched)
                    services.map((service) => (
                        <div
                            key={service._id}
                            className='service-card bg-white rounded-lg shadow-md p-4 text-center'
                        >
                            <h3 className='text-lg font-semibold text-black'>{service.name}</h3>
                            <p className='text-gray-600'>{service.description}</p>
                            <p className='text-primary mt-2'>{`Price: ₹${service.price}`}</p>
                        </div>
                    ))
                ) : (
                    // Render loading state
                    <div className="text-center col-span-full">Loading services...</div>
                )}
            </div>
        </div>
    );
};

export default Banner;
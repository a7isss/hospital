import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Use navigate for redirection
import placeholderImage from '../assets/doc4.png'; // Placeholder image
import currencySVG from '../assets/curr.svg'; // Currency symbol

const Banner = () => {
    const [services, setServices] = useState([]); // Local state for services
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Handle errors
    const { t } = useTranslation(); // Initialize translation
    const navigate = useNavigate(); // For navigation

    // Fetch services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/uservices`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success) {
                    setServices(data.services); // Populate services
                } else {
                    setError(data.message || 'Failed to fetch services');
                }
            } catch (err) {
                setError('An error occurred while fetching services');
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchServices();
    }, []); // Run on mount only once

    return (
        <div className="flex flex-col bg-primary rounded-lg px-8 sm:px-12 lg:px-16 py-10 lg:py-14 my-10 md:mx-10">
            {/* ------- Header Section ------- */}
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
                    {t('book_appointment')}
                </h2>
                <p className="text-sm sm:text-base text-white">
                    {t('explore_our_services')}
                </p>
            </div>

            {/* ------- Services Grid ------- */}
            <div className="services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {loading ? (
                    // Render placeholder cards while loading
                    Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="service-card bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col h-[20rem] sm:h-[22rem]"
                        >
                            <div className="bg-gray-300 h-2/3 w-full rounded-t-lg"></div>
                            <div className="flex-grow flex items-center justify-center p-4">
                                <p className="text-gray-500 text-sm">Loading...</p>
                            </div>
                        </div>
                    ))
                ) : error ? (
                    // Render error message if fetching fails
                    <div className="text-red-500 text-center col-span-full">
                        {error}
                    </div>
                ) : services.length > 0 ? (
                    // Render services if successfully fetched
                    services.map((service) => (
                        <div
                            key={service._id}
                            className="service-card bg-white rounded-lg shadow-md flex flex-col h-[22rem] sm:h-[22rem] hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(`/service/${service._id}`)} // Navigate on card click
                        >
                            {/* Card Image */}
                            <div className="h-[60%] w-full overflow-hidden rounded-t-lg">
                                <img
                                    src={service?.image || placeholderImage}
                                    alt={service?.name || 'Service'}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="flex-grow flex flex-col justify-between p-4">
                                {/* Name and Price */}
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-500 flex items-center mt-2">
                                        <img src={currencySVG} alt="Currency" className="w-4 h-4 mr-1" />
                                        {service.price}
                                    </p>
                                </div>

                                {/* Reserve Button */}
                                <button
                                    className="mt-4 bg-primary text-white w-full py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                    onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the button
                                >
                                    {t('reserve_now')}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    // If no services are available
                    <div className="text-gray-500 text-center col-span-full">
                        {t('no_services_found')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Banner;
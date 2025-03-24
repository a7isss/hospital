import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../assets/doc4.png'; // Placeholder image
import currencySVG from '../assets/curr.svg'; // Currency symbol
import { Link } from 'react-router-dom'; // Use React Router's Link to navigate

const Banner = () => {
    const [services, setServices] = useState([]); // Local state for services
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Handle errors
    const { t } = useTranslation(); // Initialize translation

    // Utility function to get the first sentence of the description
    const getFirstSentence = (text) => {
        if (!text) return t('no_description'); // Handle missing descriptions
        const firstSentence = text.split('.')[0]; // Split text at periods and get the first
        return firstSentence ? `${firstSentence}.` : text; // Append period to the sentence
    };

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
                            className="service-card bg-white rounded-lg shadow-md flex flex-col h-[20rem] sm:h-[22rem] hover:shadow-lg transition-shadow p-4"
                        >
                            <div className="h-2/3 mb-4">
                                <img
                                    src={service.image || placeholderImage}
                                    alt={service.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-gray-600 leading-snug mb-2">
                                    {getFirstSentence(service.description)}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <p className="text-sm sm:text-base font-medium text-gray-800">
                                        <img src={currencySVG} alt="Currency" className="inline w-4 h-4 mr-1" />
                                        {service.price}
                                    </p>
                                    <Link
                                        to={`/service/${service._id}`}
                                        className="text-sm sm:text-base text-primary font-semibold hover:underline"
                                    >
                                        {t('view_details')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // No services found
                    <div className="text-gray-500 text-center col-span-full">
                        {t('no_services_available')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Banner;
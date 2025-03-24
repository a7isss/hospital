import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../assets/doc4.png'; // Import the placeholder image

const Banner = () => {
    const [services, setServices] = useState([]); // Local state for services
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Handle errors
    const { t } = useTranslation(); // Initialize translation

    // Utility function to get first sentence of the description
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
                    setError(data.message || "Failed to fetch services");
                }
            } catch (err) {
                setError("An error occurred while fetching services");
            } finally {
                setLoading(false); // End loading state
            }
        };
        fetchServices();
    }, []); // Run on mount only once

    return (
        <div className="flex flex-col bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-10 md:mx-10">
            {/* ------- Header Section ------- */}
            <div className="py-6 sm:py-8 md:py-10 lg:py-12 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
                    {t('book_appointment')}
                </h2>
                <p className="text-sm sm:text-md lg:text-lg text-white mt-4">
                    {t('explore_our_services')}
                </p>
            </div>

            {/* ------- Services Grid ------- */}
            <div className="services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    // Render placeholder cards while loading
                    Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="service-card bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col h-60"
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
                            className="service-card bg-white rounded-lg shadow-md flex flex-col h-60 hover:shadow-lg transition-shadow"
                        >
                            {/* Image or Placeholder */}
                            <div className="h-2/3 rounded-t-lg overflow-hidden">
                                <img
                                    src={service.image || placeholderImage} // Use placeholder if no image exists
                                    alt={service.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {/* Content Section - Name, Short Description, and Price */}
                            <div className="flex-grow p-4">
                                <h3 className="text-lg font-semibold text-black truncate">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    {getFirstSentence(service.description)}
                                </p>
                                <p className="text-md font-medium text-primary mt-4">
                                    {t('price')}: ${service.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    // Handle case where no services exist
                    <div className="text-gray-500 text-center col-span-full">
                        {t('no_services_found')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Banner;
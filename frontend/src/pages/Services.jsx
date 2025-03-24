import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../assets/doc4.png'; // Placeholder Image
import currencySVG from '../assets/curr.svg'; // Currency Symbol SVG
import { Link } from 'react-router-dom'; // For Navigation Links

const Services = () => {
  const [services, setServices] = useState([]); // Services data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { t } = useTranslation(); // Translation Hook

  // Utility function to get the first sentence of the description
  const getFirstSentence = (text) => {
    if (!text) return t('no_description'); // Handle missing descriptions
    const firstSentence = text.split('.')[0]; // Get the first sentence from text
    return firstSentence ? `${firstSentence}.` : text; // Append period
  };

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/uservices`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setServices(data.services); // Set fetched services
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
  }, []); // Run only once when component mounts

  return (
      <div className="flex flex-col bg-primary rounded-lg px-8 sm:px-12 lg:px-16 py-10 lg:py-14 my-10">
        {/* ------- Header Section ------- */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            {t('our_services')}
          </h2>
          <p className="text-sm sm:text-base text-white">
            {t('choose_from_expert_services')}
          </p>
        </div>

        {/* ------- Services Grid Layout ------- */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
              // Render placeholder cards while loading
              Array.from({ length: 8 }).map((_, index) => (
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
              // Render the fetched services
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
              // Render no services found
              <div className="text-gray-500 text-center col-span-full">
                {t('no_services_available')}
              </div>
          )}
        </div>
      </div>
  );
};

export default Services;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import currencySVG from '../assets/curr.svg'; // Currency symbol
import placeholderImage from '../assets/doc4.png'; // Placeholder image

const Service = () => {
  const { id } = useParams(); // Get service ID from the route
  const [service, setService] = useState(null); // State for service
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { t } = useTranslation(); // Translation hook

  // Fetch service data by ID
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/uservices/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setService(data.service); // Set fetched service
        } else {
          setError(data.message || "Failed to fetch service");
        }
      } catch (err) {
        setError("An error occurred while fetching the service");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchService();
  }, [id]);

  // Loading UI
  if (loading) {
    return <p className="text-center text-gray-500">{t('loading')}...</p>;
  }

  // Error UI
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Render service details
  return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        {service && (
            <>
              {/* Service Image */}
              <div className="h-64 w-full rounded-t-lg overflow-hidden mb-6">
                <img
                    src={service.image || placeholderImage}
                    alt={service.name}
                    className="object-cover h-full w-full"
                />
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{service.name}</h1>

              {/* Category */}
              <p className="text-gray-500 text-sm mb-6">{t('category')}: <span className="font-semibold">{service.category}</span></p>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              {/* Price and Duration */}
              <div className="flex items-center mb-4">
                <img
                    src={currencySVG}
                    alt={t('price')}
                    className="h-5 w-5 mr-2 object-contain"
                />
                <p className="text-lg font-semibold text-gray-800">{service.price}</p>
              </div>
              {service.duration && (
                  <p className="text-sm text-gray-500">{t('duration')}: {service.duration}</p>
              )}

              {/* Availability */}
              <p className={`mt-4 text-sm ${service.available ? 'text-green-500' : 'text-red-500'}`}>
                {service.available ? t('service_available') : t('service_unavailable')}
              </p>
            </>
        )}
      </div>
  );
};

export default Service;
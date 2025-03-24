import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Service = () => {
    const { id } = useParams(); // Get the service ID from the route
    const { backendUrl, currencySymbol } = useContext(AppContext); // Access backendUrl and currencySymbol from context
    const [service, setService] = useState(null); // State to store service details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        // Fetch service details by ID
        const fetchServiceById = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user/uservices/${id}`); // API call to fetch service
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
                const data = await response.json(); // Parse JSON response
                if (data.success) {
                    setService(data.service); // Store fetched service in state
                } else {
                    setError(data.message || 'Failed to fetch service details');
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false); // Stop loading once the fetch is completed
            }
        };

        fetchServiceById();
    }, [id, backendUrl]); // Dependency array for dynamic fetching

    // Return loading state
    if (loading) return <div className="text-center text-blue-500 text-lg font-medium">Loading...</div>;

    // Return error message
    if (error)
        return <div className="text-center text-red-500 text-lg font-medium">{error}</div>;

    // Return service details on successful fetch
    return (
        <div className="service-details container mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.name}</h1>
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Service Image */}
                <div className="flex-1">
                    <img
                        src={service.image || '/assets/placeholder.png'}
                        alt={service.name}
                        className="w-full h-64 object-cover rounded-lg shadow-sm"
                    />
                </div>
                {/* Service Info */}
                <div className="flex-1">
                    <p className="text-gray-700 text-lg mb-4">{service.description}</p>
                    <p className="text-lg font-semibold text-gray-800">
                        Cost: <span className="text-primary">{currencySymbol}{service.price}</span>
                    </p>
                    <p className="text-md font-medium text-gray-600">
                        Duration: {service.duration || 'Not specified'}
                    </p>
                    <p className={`mt-2 font-medium ${service.available ? 'text-green-600' : 'text-red-600'}`}>
                        {service.available ? 'Available' : 'Not Available'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Service;
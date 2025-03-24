import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const ServicesList = () => {
    const { services, getAllServices, aToken } = useContext(AdminContext); // Access services from AdminContext

    // Fetch services when the component mounts, only if aToken is present
    useEffect(() => {
        if (aToken) {
            getAllServices();
        }
    }, [aToken, getAllServices]);

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Services</h1>
            <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                {services && services.length > 0 ? (
                    services.map((service, index) => {
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
                                key={index} // Use index as key if `_id` isn't unique
                            >
                                {/* Service Image */}
                                <img
                                    className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
                                    src={image}
                                    alt={name}
                                    onError={(e) => {
                                        e.target.src = '/default-service.png'; // Fallback if image fails
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
                                        {price !== 'N/A' ? `$${price}` : price}
                                        {' | '}
                                        <span className="font-bold">Duration:</span> {duration}
                                    </p>
                                    {/* Availability */}
                                    {available !== undefined && (
                                        <p
                                            className={`mt-2 font-bold ${
                                                available ? 'text-green-600' : 'text-red-600'
                                            }`}
                                        >
                                            {available ? 'Available' : 'Unavailable'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 mt-4">No services found.</p>
                )}
            </div>
        </div>
    );
};

export default ServicesList;
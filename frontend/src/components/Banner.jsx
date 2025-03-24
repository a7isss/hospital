import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext'; // Import AppContext to fetch services
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const { services } = useContext(AppContext); // Access services from AppContext
    const { t } = useTranslation(); // Initialize translation

    return (
        <div className='flex flex-col bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
            <div className='py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 text-center'>
                <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    {t('book_appointment')} {/* Preserving existing title */}
                </h2>
            </div>

            {/* ------- Services Listing ------- */}
            <div className='services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {services?.map((service) => (
                    <div
                        key={service._id}
                        className='service-card bg-white rounded-lg shadow-md p-4 text-center'
                    >
                        <h3 className='text-lg font-semibold text-black'>{service.name}</h3>
                        <p className='text-gray-600'>{service.description}</p>
                        <p className='text-primary mt-2'>{`Price: ₹${service.price}`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { assets } from '../assets/assets'; // Import assets as needed

const About = () => {
    const { t, i18n } = useTranslation(); // Initialize translation

    // Ensure Arabic is the default language
    React.useEffect(() => {
        i18n.changeLanguage('ar'); // Set Arabic as default language
    }, [i18n]);

    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p>
                    {t('about')} <span className='text-gray-700 font-medium'>{t('us')}</span>
                </p>
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt={t('about')} />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p>{t('streamlined_appointment_scheduling_that_fits_into_your_busy_lifestyle.')}</p>
                    <p>
                        {t('access_to_a_network_of_trusted_healthcare_professionals_in_your_area.')}
                    </p>
                    <b className='text-gray-800'>{t('our_vision')}</b>
                    <p>
                        {t('tailored_recommenations_and_remainders_to_help_you_stay_on_top_of_your_health.')}
                    </p>
                </div>
            </div>
            <div className='text-xl my-4'>
                <p>
                    {t('why')} <span className='text-gray-700 font-semibold'>{t('choose_us')}</span>
                </p>
            </div>
            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>{t('efficiency:')}</b>
                    <p>{t('streamlined_appointment_scheduling_that_fits_into_your_busy_lifestyle.')}</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>{t('convenience:')}</b>
                    <p>{t('access_to_a_network_of_trusted_healthcare_professionals_in_your_area.')}</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>{t('personalization:')}</b>
                    <p>{t('tailored_recommenations_and_remainders_to_help_you_stay_on_top_of_your_health.')}</p>
                </div>
            </div>
        </div>
    );
};

export default About;
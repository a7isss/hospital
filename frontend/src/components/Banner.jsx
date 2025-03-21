import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Banner = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(); // Initialize translation

    return (
        <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>{t('book_appointment')}</p> {/* Replace hardcoded text with translation key */}
                    <p className='mt-4'>{t('trusted_doctors')}</p> {/* Replace hardcoded text with translation key */}
                </div>
                <button
                    onClick={() => { navigate('/login'); scrollTo(0, 0); }}
                    className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'
                >
                    {t('create_account')} {/* Replace hardcoded text with translation key */}
                </button>
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
            </div>
        </div>
    );
};

export default Banner;
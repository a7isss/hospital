import React from 'react';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Header = () => {
    const { t } = useTranslation(); // Initialize translation

    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 '>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    {t('book_appointment')} <br /> {t('with_trusted_doctors')} {/* Replace hardcoded text with translation keys */}
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-20' src={assets.group_profiles} alt="" /> {/* Resized logo */}
                    <p>
                        {t('browse_doctors')} <br className='hidden sm:block' /> {t('schedule_hassle_free')} {/* Replace hardcoded text with translation keys */}
                    </p>
                </div>
                <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                    {t('book_appointment')} <img className='w-3' src={assets.arrow_icon} alt="" /> {/* Replace hardcoded text with translation key */}
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='md:w-1/2 relative'>
                <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
            </div>

            {/* --------- Cart Icon --------- */}
            <div className='absolute top-4 right-4'>
                <img className='w-8' src={assets.cart_icon} alt="Cart" /> {/* Assuming there's a cart icon in assets */}
            </div>
        </div>
    );
};

export default Header;

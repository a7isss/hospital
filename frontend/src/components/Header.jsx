import React from 'react';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Header = () => {
    const { t } = useTranslation(); // Initialize translation

    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 min-h-screen flex-col'>
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

            {/* --------- Footer --------- */}
            <footer className="bg-gray-100 py-4 mt-auto">
                <div className="container mx-auto text-center">
                    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                        <ul>
                            <li>920025092</li>
                            <li>info@lahm.sa</li>
                        </ul>
                    </div>

                    <div>
                        <hr />
                        <p className='py-5 text-sm text-center'>
                            {t('copyright', { year: 2025 })} {/* Replace hardcoded text with translation key */}
                        </p>
                        <p className='py-5 text-xsm text-center'>
                            www.lahm.sa {/* Correctly formatted text */}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Header;

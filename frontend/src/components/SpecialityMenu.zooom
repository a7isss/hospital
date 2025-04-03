import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const SpecialityMenu = () => {
    const { t } = useTranslation(); // Initialize translation

    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>{t('find_by_speciality')}</h1> {/* Replace hardcoded text with translation key */}
            <p className='sm:w-1/3 text-center text-sm'>{t('browse_trusted_doctors')}</p> {/* Replace hardcoded text with translation key */}
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
                {specialityData.map((item, index) => (
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
                        key={index}
                    >
                        <img className='w-16 sm:w-24 mb-2 ' src={item.image} alt="" />
                        <p>{t(item.speciality)}</p> {/* Replace hardcoded text with translation key */}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SpecialityMenu;
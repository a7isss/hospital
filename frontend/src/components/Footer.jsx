import React from 'react';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Footer = () => {
  const { t } = useTranslation(); // Initialize translation

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            {t('footer_description')} {/* Replace hardcoded text with translation key */}
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>{t('company')}</p> {/* Replace hardcoded text with translation key */}
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>{t('home')}</li> {/* Replace hardcoded text with translation key */}
            <li>{t('about_us')}</li> {/* Replace hardcoded text with translation key */}
            <li>{t('delivery')}</li> {/* Replace hardcoded text with translation key */}
            <li>{t('privacy_policy')}</li> {/* Replace hardcoded text with translation key */}
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>{t('get_in_touch')}</p> {/* Replace hardcoded text with translation key */}
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>920025092</li>
            <li>info@lahm.sa</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          {t('copyright', { year: 2025 })} {/* Replace hardcoded text with translation key */}
        </p>
        <p className='py-5 text-xsm text-center'>
          {('WWW.lahm.sa')} {/* Replace hardcoded text with translation key */}
        </p>
      </div>

    </div>
  );
};

export default Footer;
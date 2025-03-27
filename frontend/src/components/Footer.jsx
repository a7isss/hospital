import React from 'react';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Footer = () => {
  const { t } = useTranslation(); // Initialize translation

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
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
          {('www.lahm.sa')} {/* Replace hardcoded text with translation key */}
        </p>
      </div>

    </div>
  );
};

export default Footer;
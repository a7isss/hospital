import React from 'react';
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation(); // Initialize translation

    return (
        <div>
            {/* Header Section */}
            <Header />

            {/* Login Button */}
            <div style={{ textAlign: 'right', margin: '10px' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#007BFF', // Bootstrap primary color
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    {t('login')} {/* Translated text for login */}
                </button>
            </div>

            {/* Main Sections */}
            <SpecialityMenu />
            <TopDoctors />
            <Banner /> {/* Updated Banner component */}
        </div>
    );
};

export default Home;
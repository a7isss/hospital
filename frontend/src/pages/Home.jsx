import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner'; // Contains services grid
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation(); // Initialize translation

    return (
        <div>
            {/* Banner with Services - Now at the top */}
            <Banner />

            {/* Optional: Add Header Here If Necessary */}
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

            {/* Main Sections (Removed for now) */}
            {/* <SpecialityMenu /> */}
            {/* <TopDoctors /> */}
        </div>
    );
};

export default Home;
import React, { useContext } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner'; // Contains services grid
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext'; // App-wide context for services

const Home = () => {
    const { t } = useTranslation(); // Initialize translation
    const { services, loading } = useContext(AppContext); // Access services and loading state

    if (loading) {
        return <div>Loading...</div>; // Display a loader while data is being fetched
    }

    if (!services || services.length === 0) {
        return <div>No services available at the moment.</div>; // Gracefully handle missing data
    }

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
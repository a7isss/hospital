import React, { useContext } from 'react';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext'; // App-wide context for services
import WhatsAppChat from '../components/WhatsAppChat'; // Import WhatsAppChat component

const Home = () => {
    const { t } = useTranslation(); // Initialize translation
    const { loading } = useContext(AppContext); // Access the loading state from AppContext

    if (loading) {
        return <div>Loading...</div>; // Display a loader while data is being fetched
    }

    return (
        <div>
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
            <WhatsAppChat />
        </div>
    );
};

export default Home;
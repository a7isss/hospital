import React from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppChat from '../components/WhatsAppChat';
import useAuthStore from '../store/authStore';
import ServiceCards from '../components/ServiceCards'; // Import the ServiceCards component

const Home = () => {
    const { t } = useTranslation(); // For translations
    const { isAuthenticated, userData, visitorId, logOutUser } = useAuthStore(); // Access authentication and visitor state

    const userName = isAuthenticated
        ? userData?.name || t('user') // Display authenticated user's name
        : t('visitor'); // Display fallback for visitors

    return (
        <div>
            {/* User/Visitor Information */}
            <div style={{ textAlign: 'right', margin: '10px' }}>
                {isAuthenticated ? (
                    <div>
                        <span>{t('welcome')}, {userName}</span>

                        {/* Logout Button */}
                        <button
                            onClick={logOutUser} // Log the user out
                            style={{
                                padding: '10px 20px',
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                backgroundColor: '#DC3545', // Bootstrap `danger` color
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            {t('logout')}
                        </button>
                    </div>
                ) : (
                    <div>
                        <span>{t('welcome')}, {userName}</span>
                    </div>
                )}
            </div>

            {/* WhatsApp Chat Component */}
            <WhatsAppChat />

            {/* Service Cards Component */}
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', color: '#333' }}>
                    {t('our_services')} {/* You can add a translation key or replace with static text */}
                </h2>
                <ServiceCards /> {/* Insert ServiceCards here */}
            </div>
        </div>
    );
};

export default Home;
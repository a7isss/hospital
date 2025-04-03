import React from 'react';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import WhatsAppChat from '../components/WhatsAppChat';
import useAuthStore from '../store/authStore';

const Home = () => {
    const { t } = useTranslation(); // For translations
    const { isAuthenticated, userData, visitorId, logOutUser } = useAuthStore(); // Access authentication and visitor state

    const userName = isAuthenticated
        ? userData?.name || t('user') // Display authenticated user's name
        : t('visitor'); // Display fallback for visitors

    return (
        <div>
            <Header />

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
        </div>
    );
};

export default Home;
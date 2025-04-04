// Home.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppChat from '../components/WhatsAppChat';
import useAuthStore from '../store/authStore';
import ServiceCards from '../components/ServiceCards'; // Import the ServiceCards component

const Home = () => {
    const { t } = useTranslation(); // For translations
    const { isAuthenticated, userData, fetchUserData } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        fetchUserData: state.fetchUserData,
    }));

    useEffect(() => {
        // Fetch user data if authenticated
        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated, fetchUserData]);

    // Determine the user's name or fallback for visitors
    const userName = isAuthenticated
        ? userData?.name || t('user') // Display authenticated user's name
        : t('visitor'); // Display fallback for visitors

    return (
        <div>
            {/* User/Visitor Information */}
            <div style={{ textAlign: 'right', margin: '10px' }}>
                <span>{t('welcome')}, {userName}</span>
            </div>

            {/* WhatsApp Chat Component */}
            <WhatsAppChat />

            {/* Service Cards Component */}
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', color: '#333' }}>
                    {t('our_services')}
                </h2>
                <ServiceCards /> {/* Insert ServiceCards here */}
            </div>
        </div>
    );
};

export default Home;

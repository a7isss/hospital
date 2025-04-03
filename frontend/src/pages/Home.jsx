import React from 'react';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import WhatsAppChat from '../components/WhatsAppChat';
import useAuthStore from '../store/authStore'; // Import Zustand auth store hook

const Home = () => {
    const { t } = useTranslation(); // For translations
    const {
        token,
        userData,
        logInUser,
        logOutUser,
        handleSessionExpiry,
        isAuthenticated
    } = useAuthStore();

    const userName = userData?.name || t('user'); // Fallback user name from translation

    const handleLogin = async () => {
        // Demo payload for login
        const demoPayload = { email: 'demo@example.com', password: 'password123' };

        try {
            await logInUser(demoPayload); // Trigger login via Zustand store
            console.log("Home -> User successfully logged in.");
        } catch (error) {
            console.error("Home -> Error during login:", error);
            handleSessionExpiry(); // Handle session expiry in case of failure
        }
    };

    const handleLogout = () => {
        logOutUser(); // Trigger logout via Zustand store
    };

    return (
        <div>
            <Header />

            {/* User Information / Login Buttons */}
            <div style={{ textAlign: 'right', margin: '10px' }}>
                {isAuthenticated ? (
                    <div>
                        <span>{t('welcome')}, {userName}</span>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
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
                    <button
                        onClick={handleLogin}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#007BFF', // Bootstrap `primary` color
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        {t('login')}
                    </button>
                )}
            </div>

            {/* WhatsApp Chat Component */}
            <WhatsAppChat />
        </div>
    );
};

export default Home;
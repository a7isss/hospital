import React, { useContext } from 'react';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext'; // Access authentication state through AppContext
import WhatsAppChat from '../components/WhatsAppChat'; // Import WhatsAppChat component

const Home = () => {
    const { t } = useTranslation();
    const { token, userData, handleSessionExpiry, logInUser, logOutUser } = useContext(AppContext); // Access AppContext for authentication state

    const isAuthenticated = !!token; // Determine authentication state based on token existence
    const userName = userData?.name || t('user'); // Fallback to a default translation if username is unavailable

    const handleLogin = async () => {
        // Temporary hardcoded login payload for demonstration
        const demoPayload = { email: 'demo@example.com', password: 'password123' };

        try {
            await logInUser(demoPayload); // Log in the user via AppContext
            console.log("Home -> User successfully logged in.");
        } catch (error) {
            console.error("Home -> Error during login:", error);
            handleSessionExpiry(); // Handle session expiry in case of failure
        }
    };

    const handleLogout = () => {
        logOutUser(); // Log out the user via AppContext
    };

    return (
        <div>
            <Header />

            {/* User Info or Login */}
            <div style={{ textAlign: 'right', margin: '10px' }}>
                {isAuthenticated ? (
                    <div>
                        <span>{t('welcome')}, {userName}</span>

                        {/* Button to log out */}
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '10px 20px',
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                backgroundColor: '#DC3545', // Bootstrap danger color
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            {t('logout')}
                        </button>

                        {/* Space for additional options when logged in */}
                        {/*
                        <div>
                            <button style={{ marginTop: '10px' }}>
                                {t('extra_option_1')}
                            </button>
                            <button style={{ marginTop: '10px' }}>
                                {t('extra_option_2')}
                            </button>
                        </div>
                        */}
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
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
                        {t('login')}
                    </button>
                )}
            </div>

            {/* WhatsApp Chat */}
            <WhatsAppChat />
        </div>
    );
};

export default Home;
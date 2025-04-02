import React, { useContext } from 'react';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext'; // Import UserContext for user state
import WhatsAppChat from '../components/WhatsAppChat'; // Import WhatsAppChat component

const Home = () => {
    const { t } = useTranslation();
    const { isAuthenticated, logInUser, user, logOutUser } = useContext(UserContext); // Get user-related states and actions

    const handleLogin = async () => {
        // Temporary hardcoded login payload for demonstration
        const demoPayload = { email: 'demo@example.com', password: 'password123' };

        try {
            await logInUser(demoPayload); // Log in the user via UserContext
            console.log("Home -> User successfully logged in.");
        } catch (error) {
            console.error("Home -> Error during login:", error);
        }
    };

    const handleLogout = () => {
        logOutUser(); // Logout user via UserContext
    };

    return (
        <div>
            <Header />

            {/* User Info or Login */}
            <div style={{ textAlign: 'right', margin: '10px' }}>
                {isAuthenticated ? (
                    <div>
                        <span>{t('welcome')}, {user?.name || t('user')}</span>
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
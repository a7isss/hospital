import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext.jsx';
import CartProvider from './contexts/CartContext.jsx'; // Import CartProvider
import './i18n'; // Import i18n configuration
import i18n from 'i18next'; // Import i18n instance

// Dynamically set the `dir` attribute based on the selected language
i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AppContextProvider>
            <CartProvider> {/* Wrap the app with CartProvider */}
                <App />
            </CartProvider>
        </AppContextProvider>
    </BrowserRouter>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { CartContextProvider } from './context/CartContext.jsx'; // Import CartContextProvider by its named export
import './i18n'; // Import i18n configuration
import i18n from 'i18next'; // Import i18n instance

// Dynamically set the `dir` attribute based on the selected language
i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
            <CartContextProvider>
                <App />
            </CartContextProvider>
    </BrowserRouter>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext.jsx';
import './i18n'; // Import i18n configuration
import i18n from 'i18next'; // Import i18n instance

// Dynamically set the `dir` attribute based on the current language
i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lng); // Also update the `lang` attribute dynamically
});

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
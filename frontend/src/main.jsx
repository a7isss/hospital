import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'; // Home page component
import Services from './pages/Services.jsx'; // Services page component
import Service from './pages/Service.jsx'; // Individual service details page
import NotFound from './pages/NotFound.jsx'; // 404 Not Found page (if required)

const App = () => {
    return (
        <div className="App">
            {/* Define your routes here */}
            <Routes>
                <Route path="/" element={<Home />} /> {/* Main home page */}
                <Route path="/services" element={<Services />} /> {/* Services page */}
                <Route path="/service/:id" element={<Service />} /> {/* Individual service page */}
                <Route path="*" element={<NotFound />} /> {/* Catch-all for undefined routes */}
            </Routes>
        </div>
    );
};

export default App;
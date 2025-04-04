import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Header from "./components/Header";
import Home from "./pages/Home";
import Partners from "./pages/Partners";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Subscriptions from "./pages/Subscriptions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next"; // Import useTranslation
import Nav from "./components/Nav"; // Import Nav component
import "./i18n"; // Import the i18n configuration

const App = () => {
    const { t } = useTranslation(); // Use the translation hook

    const {
        initializeVisitorCart,
        fetchUserData,
        fetchServices,
        isAuthenticated,
        loading,
        error,
    } = useAuthStore((state) => ({
        initializeVisitorCart: state.initializeVisitorCart,
        fetchUserData: state.fetchUserData,
        fetchServices: state.fetchServices,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
    }));

    useEffect(() => {
        const initializeApp = async () => {
            try {
                console.log("Initializing application...");

                // Ensure visitor cart is initialized
                await initializeVisitorCart();
                console.log("Visitor cart initialized.");

                // If authenticated, fetch user data
                if (isAuthenticated) {
                    console.log("Fetching user data...");
                    await fetchUserData();
                }

                // Fetch available services for the app
                console.log("Fetching services...");
                await fetchServices();

                console.log("App initialization complete.");
            } catch (error) {
                console.error("Error during app initialization:", error);
            }
        };

        initializeApp();
    }, [initializeVisitorCart, fetchUserData, fetchServices, isAuthenticated]);

    return (
        <div className="flex flex-col h-screen">
            {/* Toast Notifications */}
            <ToastContainer autoClose={5000} />

            {/* Header (Primary Navigation) */}
            <Header />

            {/* Content Area */}
            <main className="flex-1 overflow-auto">
                {/* Display Loading Indicator */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white"></div>
                    </div>
                )}

                {/* Display Error if Any */}
                {error && (
                    <div className="text-center text-red-600 font-semibold bg-red-50 py-4">
                        {`An error occurred: ${error}`}
                    </div>
                )}

                {/* Application Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/appointment" element={<Appointment />} />
                    <Route path="/my-appointments" element={<MyAppointments />} />
                    <Route path="/profile" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    {!isAuthenticated && (
                        <Route path="/my-profile" element={<Navigate to="/login" />} />
                    )}
                    {isAuthenticated && (
                        <Route path="/my-profile" element={<MyProfile />} />
                    )}
                </Routes>
            </main>

            {/* Footer Component (Optional Navigation Bar) */}
            <Nav />
        </div>
    );
};

export default App;

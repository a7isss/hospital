import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Header from "./components/Header.jsx";
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
import { initReactI18next } from "react-i18next";
import Nav from "./components/Nav"; // Import Nav component

// i18n language initialization
i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                book_appointment: "Book Your Appointment",
                with_trusted_doctors: "With Trusted Doctors",
            },
        },
    },
    lng: "ar", // Default language
    fallbackLng: "ar", // Fallback language
    interpolation: {
        escapeValue: false, // React already escapes by default
    },
});

const App = () => {
    const {
        initializeVisitor,
        fetchUserData,
        fetchServices,
        isAuthenticated,
        loading,
        error,
    } = useAuthStore((state) => ({
        initializeVisitor: state.initializeVisitor,
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

                // Ensure visitor mode is initialized
                await initializeVisitor();
                console.log("Visitor initialized.");

                // If authenticated, fetch user data
                if (isAuthenticated) {
                    console.log("Fetching user data...");
                    await fetchUserData();
                }

                // Fetch services for the app
                console.log("Fetching services...");
                await fetchServices();

                console.log("App initialization complete.");
            } catch (error) {
                console.error("Error during app initialization:", error);
            }
        };

        initializeApp();
    }, [initializeVisitor, fetchUserData, fetchServices, isAuthenticated]);

    return (
        <div className="flex flex-col h-screen">
            {/* Toast Notifications */}
            <ToastContainer autoClose={5000} />

            {/* Header (Top Navigation Bar) */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1">
                {/* Loading Indicator */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white"></div>
                    </div>
                )}
                {/* Error Indicator */}
                {error && (
                    <div className="text-center text-red-600 font-semibold bg-red-50 py-4">
                        {`An error occurred: ${error}`}
                    </div>
                )}
                {/* Page Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route
                        path="/login"
                        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/appointment/:id" element={<Appointment />} />
                    <Route
                        path="/my-appointments"
                        element={isAuthenticated ? <MyAppointments /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/my-profile"
                        element={isAuthenticated ? <MyProfile /> : <Navigate to="/login" />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>

            {/* Sticky Footer (Bottom Navigation Bar) */}
            <Nav />
        </div>
    );
};

export default App;
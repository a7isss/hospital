import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useVisitorStore from "./store/visitorStore";
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
import "./i18n";

const App = () => {
    const { isAuthenticated, fetchUserData, loading, error } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated,
        fetchUserData: state.fetchUserData,
        loading: state.loading,
        error: state.error,
    }));

    const { fetchServices, generateVisitorId } = useVisitorStore((state) => ({
        fetchServices: state.fetchServices,
        generateVisitorId: state.generateVisitorId,
    }));

    useEffect(() => {
        const initializeApp = async () => {
            try {
                console.log("Initializing application...");

                // Generate a visitor ID (always required for visitors)
                generateVisitorId();
                console.log("Visitor ID initialized.");

                // If authenticated, fetch user data
                if (isAuthenticated) {
                    console.log("Authenticated user detected. Fetching data...");
                    await fetchUserData();
                } else {
                    console.log("No authenticated user. Fetching visitor services...");
                    await fetchServices(); // For visitors only
                }

                console.log("App initialization complete.");
            } catch (error) {
                console.error("Error during app initialization:", error);
            }
        };

        initializeApp(); // Run initialization logic when the app loads
    }, [isAuthenticated, fetchUserData, fetchServices, generateVisitorId]);

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
                    {/* Public / Visitor Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />

                    {/* Authenticated Routes (Protected) */}
                    {isAuthenticated ? (
                        <>
                            <Route path="/appointment" element={<Appointment />} />
                            <Route path="/my-appointments" element={<MyAppointments />} />
                            <Route path="/my-profile" element={<MyProfile />} />
                        </>
                    ) : (
                        <>
                            {/* Redirect authenticated-only routes to Login */}
                            <Route path="/appointment" element={<Navigate to="/login" replace />} />
                            <Route
                                path="/my-appointments"
                                element={<Navigate to="/login" replace />}
                            />
                            <Route path="/my-profile" element={<Navigate to="/login" replace />} />
                        </>
                    )}

                    {/* Login Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

        </div>
    );
};

export default App;
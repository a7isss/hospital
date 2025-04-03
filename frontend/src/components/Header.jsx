import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";
import Home from "../pages/Home";
import Partners from "../pages/Partners";
import Login from "../pages/Login";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Appointment from "../pages/Appointment";
import MyAppointments from "../pages/MyAppointments";
import MyProfile from "../pages/MyProfile";
import Service from "../pages/Service";
import Services from "../pages/Services";
import Cart from "../pages/Cart";
import Subscriptions from "../pages/Subscriptions";
import Doctors from "../components/Doctors";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            await initializeVisitor();
            if (isAuthenticated) await fetchUserData();
            await fetchServices();
        };
        initializeApp();
    }, [initializeVisitor, fetchUserData, fetchServices, isAuthenticated]);

    return (
        <div className="flex flex-col h-screen">
            {/* Toast Notifications */}
            <ToastContainer autoClose={5000} />

            {/* Header Section */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 p-4">
                {loading && <div className="text-center">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

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
                    <Route path="/my-appointments" element={isAuthenticated ? <MyAppointments /> : <Navigate to="/login" />} />
                    <Route path="/my-profile" element={isAuthenticated ? <MyProfile /> : <Navigate to="/login" />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>

            {/* Sticky Footer */}
            <footer className="bg-gray-200 py-4 text-center">
                <p>© 2025 YourApp. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
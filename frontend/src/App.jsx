import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "./store/authStore"; // Zustand's global state
import Navbar from "./components/Navbar";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home";
import Partners from "./pages/Partners";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
// import Verify from './pages/Verify';
import Service from "./pages/Service";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Subscriptions from "./pages/Subscriptions";
import Doctors from "./components/Doctors";
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

    const navigate = useNavigate();

    // Initialize visitor and fetch necessary data on app load
    useEffect(() => {
        const initializeApp = async () => {
            await initializeVisitor(); // Initialize visitor ID (for unauthenticated users)
            if (isAuthenticated) {
                await fetchUserData(); // Fetch user data for authenticated users
            }
            await fetchServices(); // Fetch globally available services
        };

        initializeApp();
    }, [initializeVisitor, fetchUserData, fetchServices, isAuthenticated]);

    return (
        <div className="mx-2 sm:mx-[5%] lg:mx-[10%]">
            {/* Toast Notifications */}
            <ToastContainer
                position={document.documentElement.getAttribute("dir") === "rtl" ? "top-left" : "top-right"}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={document.documentElement.getAttribute("dir") === "rtl"}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Navbar */}
            <Navbar />

            {/* Loading indicator */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white"></div>
                </div>
            )}

            {/* Main Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/services" element={<Services />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointment/:docId" element={<Appointment />} />
                <Route path="/service/:id" element={<Service />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/doctors" element={<Doctors />} />

                {/* Authenticated Routes */}
                <Route
                    path="/my-appointments"
                    element={
                        isAuthenticated ? <MyAppointments /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/my-profile"
                    element={isAuthenticated ? <MyProfile /> : <Navigate to="/login" />}
                />
            </Routes>

            {/* Error Notification */}
            {error && (
                <div className="fixed bottom-4 left-4 p-4 bg-red-500 text-white rounded shadow-md">
                    {error}
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="pb-16">
                <Nav />
            </div>
        </div>
    );
};

export default App;
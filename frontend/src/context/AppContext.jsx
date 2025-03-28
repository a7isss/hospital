import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "₹"; // Global currency symbol
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API URL from environment variables

    // State variables
    const [token, setToken] = useState(localStorage.getItem("token") || null); // Token for logged-in users
    const [userData, setUserData] = useState(null); // Logged-in user data (e.g. name, email, etc.)
    const [services, setServices] = useState([]); // List of services offered, fetched globally
    const [doctors, setDoctors] = useState([]); // List of doctors fetched globally
    const [loading, setLoading] = useState(false); // Loader state (for API interactions)
    const [error, setError] = useState(null); // Error state for global error messages
    const [registrationData, setRegistrationData] = useState(null); // Track registration progress
    const [registrationError, setRegistrationError] = useState(null);

    // Fetch current user data using login token
    const fetchUserData = async () => {
        if (!token) return; // Skip if the user isn't logged in
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(data.user); // Store received user data
        } catch (error) {
            console.error("AppContext - Error fetching user data:", error);
            // Clear invalid token if API call fails
            setToken(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    // Define fetchServices function
    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/services`);
            if(data.services && Array.isArray(data.services)) {
                setServices(data.services);
            } else {
                console.error("Invalid services format:", data);
                setServices([]);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setServices([]);
        }
    };

    // Fetch available doctors from the backend
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/doctors`);
            setDoctors(data.doctors); // Store fetched doctors globally
        } catch (error) {
            console.error("AppContext - Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    // Logout function: clears user-specific data
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUserData(null);
    };

    // Initialize services, doctors, and user data on app load or token change
    useEffect(() => {
        fetchServices(); // Fetch global services
        fetchDoctors(); // Fetch global doctors
        fetchUserData(); // Fetch user-specific data (if token is available)
    }, [token]); // Dependencies: Re-run if token changes

    // Return `AppContext` values and functions for use throughout the app
    return (
        <AppContext.Provider
            value={{
                currencySymbol,
                backendUrl,
                token,
                setToken,
                userData,
                setUserData,
                services,
                doctors,
                loading,
                error,
                logout,
                registrationData,
                setRegistrationData,
                registrationError,
                setRegistrationError,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

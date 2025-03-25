// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import login from "../pages/Login.jsx";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = '₹'; // Currency symbol for global use
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend URL from environment

    // State for managing app-wide needs
    const [token, setToken] = useState(localStorage.getItem('token') || null); // Manage user login state
    const [userData, setUserData] = useState(null); // Logged-in user information
    const [doctors, setDoctors] = useState([]); // List of doctors for use across components
    const [services, setServices] = useState([]); // List of services for banner/component display
    const [loading, setLoading] = useState(false); // Global loading state for API calls

    // Fetch user data if logged in
    const fetchUserData = async () => {
        if (!token) return; // No need to fetch if not logged in
        try {
            setLoading(true); // Start loading
            const { data } = await axios.get(`${backendUrl}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(data.user); // Set user data
        } catch (error) {
            console.error("Error fetching user data", error);
            setToken(null); // Clear token on failure
            localStorage.removeItem('token'); // Cleanup localStorage
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Global logout handler
    const logout = () => {
        setToken(null);
        setUserData(null);
        localStorage.removeItem('token'); // Clear token from storage
    };

    // Fetch doctors (shared global data)
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/doctors`);
            setDoctors(data.doctors); // Set the list of doctors
        } catch (error) {
            console.error("Failed to fetch doctors", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch services for visitors and users
    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/services`); // Replace `/api/services` with your endpoint
            setServices(data.services); // Assuming the API returns a list of services
        } catch (error) {
            console.error("Failed to fetch services", error);
            setServices([]); // Ensure services is an empty array on failure
        }
    };

    // Fetch data depending on the user's login state
    useEffect(() => {
        if (token) {
            fetchUserData(); // Fetch user-specific data
        } else {
            setUserData(null); // Clear user data when not logged in
        }
        fetchServices(); // Fetch services (same for both visitors and logged-in users)
    }, [token]); // Refetch when the token changes

    // Shared provider value
    const value = {
        token,
        setToken,
        userData,
        setUserData,
        login,
        logout,
        doctors,
        fetchDoctors,
        services, // Add services to the context value
        currencySymbol,
        backendUrl,
        loading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
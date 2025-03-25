// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = '₹'; // Currency symbol for global use
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend URL from environment

    // State for managing app-wide needs
    const [token, setToken] = useState(localStorage.getItem('token') || null); // Manage user login state
    const [userData, setUserData] = useState(null); // Logged-in user information
    const [doctors, setDoctors] = useState([]); // List of doctors for use across components
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

    // Fetch doctors (example of shared global data)
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

    // Fetch user data if token changes
    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setUserData(null); // Clear user data when not logged in
        }
    }, [token]);

    // Shared provider value
    const value = {
        token,
        setToken,
        userData,
        setUserData,
        logout,
        doctors,
        fetchDoctors,
        currencySymbol,
        backendUrl,
        loading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

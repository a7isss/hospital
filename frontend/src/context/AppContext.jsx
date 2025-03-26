import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // UUID generator for unique visitor IDs

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "₹"; // Global currency symbol
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API URL from environment variables

    // State variables
    const [token, setToken] = useState(localStorage.getItem("token") || null); // Token for logged-in users
    const [userData, setUserData] = useState(null); // Logged-in user data (e.g. name, email, etc.)
    const [visitorID, setVisitorID] = useState(localStorage.getItem("visitorID") || null); // Visitor ID for guest users
    const [services, setServices] = useState([]); // List of services offered, fetched globally
    const [doctors, setDoctors] = useState([]); // List of doctors globally
    const [loading, setLoading] = useState(false); // Loader state (for API interactions)
    const [error, setError] = useState(null); // Error state for global error messages

    // Generate a new visitor ID if not already present
    useEffect(() => {
        if (!visitorID) {
            console.log("No visitorID found. Creating a new one...");
            const newVisitorID = uuidv4(); // Create unique visitor ID
            setVisitorID(newVisitorID);
            localStorage.setItem("visitorID", newVisitorID); // Persist it in localStorage
            console.log("Generated and stored visitorID:", newVisitorID);
        } else {
            console.log("Existing visitorID found:", visitorID);
        }
    }, [visitorID]);

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

    // Fetch available services from the backend
    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/services`);
            setServices(data.services); // Store fetched services globally
        } catch (error) {
            console.error("AppContext - Error fetching services:", error);
            setError("Failed to load services.");
        } finally {
            setLoading(false);
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
        setToken(null); // Clear token from state
        setUserData(null); // Clear user data
        localStorage.removeItem("token"); // Remove token from localStorage
    };

    // Fetch initial data on app load and whenever the token changes
    useEffect(() => {
        fetchServices(); // Load global services
        fetchDoctors(); // Load global doctors
        fetchUserData(); // Load user-specific data
    }, [token]); // Re-run if the token changes

    // Return values/functions to be available throughout the app
    return (
        <AppContext.Provider
            value={{
                currencySymbol,
                backendUrl,
                token,
                userData,
                visitorID,
                services,
                doctors,
                loading,
                error,
                setToken, // Function to set authentication token manually
                logout, // Global logout function
                fetchUserData, // Explicitly fetch user data when required
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator to create unique visitor IDs

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "₹"; // Global currency symbol
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API URL from environment variables

    // State for managing app-wide variables
    const [token, setToken] = useState(localStorage.getItem("token") || null); // User token for authentication
    const [userData, setUserData] = useState(null); // Store user-specific data (e.g., name, email)
    const [visitorID, setVisitorID] = useState(localStorage.getItem("visitorID") || null); // Visitor ID for guests
    const [services, setServices] = useState([]); // List of services (e.g., for display in the frontend)
    const [doctors, setDoctors] = useState([]); // List of doctors (used globally on different components/pages)
    const [loading, setLoading] = useState(false); // Loading state for API requests
    const [error, setError] = useState(null); // State for storing errors (e.g., from API calls)

    // Generate a unique visitor ID if none exists
    useEffect(() => {
        if (!visitorID) {
            console.log("No visitorID found. Creating a new one...");
            const newVisitorID = uuidv4();
            setVisitorID(newVisitorID);
            localStorage.setItem("visitorID", newVisitorID); // Persist visitor ID in localStorage
            console.log("Generated and stored visitorID:", newVisitorID);
        } else {
            console.log("Existing visitorID found:", visitorID);
        }
    }, [visitorID]);

    // Fetch current user data (if logged in)
    const fetchUserData = async () => {
        if (!token) return; // Skip if no token is available
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(data.user); // Store user data (received from API response)
        } catch (error) {
            console.error("Error fetching user data:", error);
            setToken(null); // Clear invalid token
            localStorage.removeItem("token"); // Remove token from localStorage
        } finally {
            setLoading(false);
        }
    };

    // Fetch services from the backend
    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/services`);
            setServices(data.services); // Store services in the state
        } catch (error) {
            console.error("Error fetching services:", error);
            setError("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch doctors (for the doctors listing page or banner)
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/doctors`);
            setDoctors(data.doctors); // Store doctors in the state
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    // Global logout function
    const logout = () => {
        setToken(null); // Clear token state
        setUserData(null); // Remove user data
        localStorage.removeItem("token"); // Clear token from localStorage
    };

    // Fetch initial data when the component mounts
    useEffect(() => {
        fetchServices(); // Load all services
        fetchDoctors(); // Load doctors
        fetchUserData(); // Load current user data (only if token exists)
    }, [token]); // Refetch user data if the token changes

    return (
        <AppContext.Provider
            value={{
                currencySymbol,
                backendUrl,
                visitorID,
                token,
                setToken,
                userData,
                doctors,
                services,
                loading,
                error,
                logout,
                fetchServices,
                fetchUserData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
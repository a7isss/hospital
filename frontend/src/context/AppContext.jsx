import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator for unique visitorIDs

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

    // **New: State for visitorID**
    const [visitorID, setVisitorID] = useState(localStorage.getItem('visitorID') || null);

    // **New: Generate visitorID when none exists**
    useEffect(() => {
        if (!visitorID) {
            // Log that visitorID generation is starting
            console.log("No visitorID found. Generating a new one...");

            try {
                // Generate a new unique visitorID
                const newVisitorID = uuidv4();

                console.log("Generated visitorID:", newVisitorID); // Debug: Log the generated visitorID

                // Set visitorID in React state and persist it in localStorage
                setVisitorID(newVisitorID);
                localStorage.setItem("visitorID", newVisitorID);

                // Debug: Confirm that the visitorID is now set in localStorage
                console.log("Persisted visitorID in localStorage:", localStorage.getItem("visitorID"));
            } catch (error) {
                // Handle potential errors during visitorID generation/storage
                console.error("Error generating or saving visitorID:", error);
            }
        } else {
            // Debug: Log that visitorID already exists
            console.log("Existing visitorID found in state or localStorage:", visitorID);
        }
    }, [visitorID]);

    // Fetch user data if logged in
    const fetchUserData = async () => {
        if (!token) return; // No need to fetch if not logged in
        try {
            setLoading(true); // Start loading
            const { data } = await axios.get(`${backendUrl}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` }, // Token already has the "Bearer" prefix
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
        }
    };

    // Utility function to get `Authorization` headers
    const getAuthHeaders = () => {
        return {
            Authorization: token
                ? `Bearer ${token}` // Add "Bearer" prefix for logged-in user's token
                : `Bearer ${visitorID}`, // Add "Bearer" prefix for visitorID for visitors
        };
    };

    return (
        <AppContext.Provider
            value={{
                currencySymbol,
                backendUrl,
                token,
                setToken,
                userData,
                setUserData,
                doctors,
                setDoctors,
                services,
                setServices,
                loading,
                setLoading,
                visitorID,
                getAuthHeaders, // Expose the function for child components
                fetchUserData,
                fetchDoctors,
                fetchServices,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
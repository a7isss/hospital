import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "₹"; // Global currency symbol
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API URL from environment variables

    // State variables
    const [token, setToken] = useState(authService.getToken()); // Initialize token from authService
    const [userData, setUserData] = useState(null); // User data state
    const [services, setServices] = useState([]); // List of services offered
    const [doctors, setDoctors] = useState([]); // List of doctors globally
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [servicesLoading, setServicesLoading] = useState(false); // Services loading state

    // Handle session expiration globally
    const handleSessionExpiry = () => {
        authService.logoutUser(); // Clear token in authService
        setToken(null); // Clear token
        setUserData(null); // Clear user data
        console.warn("Session expired. Please log in again."); // Add appropriate warnings
        // Optional UX improvement: Notify users (e.g., Toast)
        // toast.info("Your session has expired. Please log in again.");
    };

    // Fetch the current user's data
    const fetchUserData = async () => {
        const token = authService.getToken();
        if (!token || authService.isTokenExpired(token)) {
            handleSessionExpiry(); // Handle token expiration or absence
            return;
        }
        try {
            setError(null); // Reset any previous errors
            setLoading(true);
            const { user } = await authService.getProfile(); // Profile fetch handles tokenExpiry
            setUserData(user);
        } catch (err) {
            console.error("Error fetching user data:", err);
            handleSessionExpiry(); // Catch errors related to invalid/expired tokens
        } finally {
            setLoading(false);
        }
    };

    // Fetch globally available doctors
    const fetchDoctors = async () => {
        const token = authService.getToken();
        if (!token || authService.isTokenExpired(token)) {
            handleSessionExpiry(); // Handle expired or missing token
            return;
        }
        try {
            setError(null);
            setLoading(true);
            const { data } = await authService.getDoctors(); // Adjust API
            setDoctors(data.doctors);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError("Unable to fetch doctors.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch globally available services
    const fetchServices = async () => {
        const token = authService.getToken();
        if (!token || authService.isTokenExpired(token)) {
            handleSessionExpiry(); // Handle expired or missing token
            return;
        }
        try {
            setError(null); // Reset error state
            setServicesLoading(true);
            const { data } = await authService.getServices(); // Adjust API
            setServices(data.services || []);
        } catch (err) {
            console.error("Error fetching services:", err);
            setError("Unable to fetch services.");
        } finally {
            setServicesLoading(false);
        }
    };

    // Clear session when token is invalid or user logs out
    const clearSession = () => {
        authService.logoutUser(); // Clear token in authService
        setToken(null); // Clear token
        setUserData(null); // Clear user data
        console.log("Session cleared due to logout or token invalidation.");
        // Optional: Show toast
        // toast.info("Your session has expired. Please log in again.");
    };

    // Monitor token changes with cleanup
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchUserDataSafe = async () => {
            if (!token || authService.isTokenExpired(token)) {
                handleSessionExpiry(); // Check token validity during token change
                return;
            }
            try {
                setLoading(true);
                const { user } = await authService.getProfile({ signal });
                setUserData(user);
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    console.error("Error fetching user data:", err);
                    handleSessionExpiry();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataSafe();

        // Cleanup on unmount or token change
        return () => controller.abort();
    }, [token]);

    return (
        <AppContext.Provider
            value={{
                currencySymbol,
                backendUrl,
                token,
                setToken,
                userData,
                services,
                setServices,
                doctors,
                loading,
                error,
                servicesLoading,
                fetchDoctors,
                fetchServices,
                fetchUserData, // Explicit for token refresh scenarios
                clearSession,
                handleSessionExpiry, // Explicit for manual session expiration
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
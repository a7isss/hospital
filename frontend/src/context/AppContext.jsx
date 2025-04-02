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
        console.warn("AppContext -> Handling session expiry.");
        authService.logoutUser(); // Clear token in authService
        setToken(null); // Clear token state
        setUserData(null); // Clear user data state
        // Optional UX improvement: Notify users (e.g., Toast)
        // toast.info("Your session has expired. Please log in again.");
    };

    // Fetch the current user's data
    const fetchUserData = async () => {
        const token = authService.getToken();
        console.log("AppContext -> fetchUserData -> Token:", token);

        if (!token || authService.isTokenExpired(token)) {
            console.warn("AppContext -> Token is invalid or expired. Logging out.");
            handleSessionExpiry();
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const { user } = await authService.getProfile(); // Fetch user profile
            console.log("AppContext -> fetchUserData -> Fetched user:", user);
            setUserData(user);
        } catch (err) {
            console.error("AppContext -> fetchUserData -> Error fetching user data:", err);
            handleSessionExpiry();
        } finally {
            setLoading(false);
        }
    };

    // Log in a user
    const logInUser = async (payload) => {
        try {
            setError(null); // Clear any previous errors
            setLoading(true);
            console.log("AppContext -> Logging in user...");
            const response = await authService.loginUser(payload); // Get token and user data from API

            // Save token to state and storage
            const token = response.token;
            if (!token || authService.isTokenExpired(token)) {
                console.warn("AppContext -> LogInUser -> Received expired or invalid token.");
                handleSessionExpiry();
                return;
            }
            setToken(token); // Save token to AppContext state
            // Fetch user data
            await fetchUserData();
        } catch (error) {
            console.error("AppContext -> logInUser -> Error:", error);
            setError("Failed to log in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    // Register a new user
    const registerUser = async (payload) => {
        try {
            setError(null); // Clear any previous errors
            setLoading(true);
            console.log("AppContext -> Registering user...");
            const response = await authService.registerUser(payload); // Get token and user data from API

            // Save token to state and storage
            const token = response.token;
            if (!token || authService.isTokenExpired(token)) {
                console.warn("AppContext -> RegisterUser -> Received expired or invalid token.");
                handleSessionExpiry();
                return;
            }
            setToken(token); // Save token to AppContext state
            // Fetch user data
            await fetchUserData();
        } catch (error) {
            console.error("AppContext -> registerUser -> Error:", error);
            setError("Failed to register. Please try again.");
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
        console.log("AppContext -> Clearing session...");
        authService.logoutUser(); // Clear token in authService
        setToken(null); // Clear token state
        setUserData(null); // Clear user data state
    };

    // Initialize user data fetch on mount
    useEffect(() => {
        console.log("AppContext -> Initializing fetchUserData...");
        fetchUserData();
    }, []);

    return (
        <AppContext.Provider
            value={{
                token,
                setToken,
                userData,
                handleSessionExpiry,
                fetchUserData,
                logInUser,
                registerUser,
                clearSession,
                fetchDoctors,
                fetchServices,
                services,
                doctors,
                currencySymbol,
                backendUrl,
                loading,
                error,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
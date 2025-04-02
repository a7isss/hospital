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
            const { token: newToken, refreshToken } = await authService.loginUser(payload); // Login and get tokens

            // Handle session and fetch user data
            if (!newToken || authService.isTokenExpired(newToken)) {
                console.warn("AppContext -> logInUser -> Received expired or invalid token.");
                handleSessionExpiry();
                return;
            }

            // Save tokens via authService (already handled inside authService)
            setToken(newToken);
            await fetchUserData(); // Fetch and set user data after successful login
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
            const { token: newToken, refreshToken } = await authService.registerUser(payload); // Register and get tokens

            // Handle session and fetch user data
            if (!newToken || authService.isTokenExpired(newToken)) {
                console.warn("AppContext -> registerUser -> Received expired or invalid token.");
                handleSessionExpiry();
                return;
            }

            // Save tokens via authService (already handled inside authService)
            setToken(newToken);
            await fetchUserData(); // Fetch and set user data after successful registration
        } catch (error) {
            console.error("AppContext -> registerUser -> Error:", error);
            setError("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = authService.getToken();
        if (token && !authService.isTokenExpired(token)) {
            setToken(token); // Update token state if valid
            fetchUserData(); // Fetch and update user data
        }
    }, []); // Runs once on mount to sync state with localStorage
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
                clearSession: handleSessionExpiry, // Alias for clarity
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
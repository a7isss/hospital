import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { AppContext } from "./AppContext";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    // Use fallback in case AppContext is not properly initialized
    const appContext = useContext(AppContext) || {};

    // Safely destructure properties with default values
    const {
        token = null,
        setToken = () => {},
        userData = null,
        handleSessionExpiry = () => {}
    } = appContext;

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // React to token or user data changes
    useEffect(() => {
        if (token && userData) {
            if (authService.isTokenExpired(token)) {
                // If the token is expired, expire the session
                handleSessionExpiry(); // Notify AppContext of session expiration
                return;
            }
            setUser(userData); // Sync user state with AppContext's userData
            setIsAuthenticated(true);
        } else {
            setUser(null); // Clear user state when logged out
            setIsAuthenticated(false);
        }
    }, [token, userData]);

    // Login user
    const logInUser = async (payload) => {
        const response = await authService.loginUser(payload); // Get token and user data
        if (authService.isTokenExpired(response.token)) {
            // Handle cases where the returned token is already expired (unlikely)
            handleSessionExpiry();
            return;
        }
        setToken(response.token); // Notify AppContext
    };

    // Register user
    const registerUser = async (payload) => {
        const response = await authService.registerUser(payload);
        if (authService.isTokenExpired(response.token)) {
            // Handle cases where the returned token is already expired (unlikely)
            handleSessionExpiry();
            return;
        }
        setToken(response.token); // Notify AppContext
    };

    // Logout user
    const logOutUser = () => {
        authService.logoutUser(); // Clear token from authService
        setToken(null); // Notify AppContext
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, logInUser, logOutUser, registerUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
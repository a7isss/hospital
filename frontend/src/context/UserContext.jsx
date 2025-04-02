import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { AppContext } from "./AppContext";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    // Use fallback in case AppContext is not properly initialized
    const appContext = useContext(AppContext) || {};

    // Safely destructure properties with default values, and log unexpected cases
    const {
        token = null,
        setToken = () => {},
        userData = null,
        handleSessionExpiry = () => {}
    } = appContext;

    // Logging diagnostics
    console.log("UserContext -> AppContext Values:", { token, userData });

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // React to token or user data changes
    useEffect(() => {
        console.log("UserContext -> Token or UserData changed:", { token, userData });
        if (token && userData) {
            if (authService.isTokenExpired(token)) {
                console.warn("Token expired. Handling session expiry.");
                handleSessionExpiry(); // Notify AppContext of session expiration
                return;
            }
            setUser(userData); // Sync user state with AppContext's userData
            setIsAuthenticated(true);
        } else {
            console.warn("Token or UserData is missing. Resetting user state.");
            setUser(null); // Clear user state when logged out
            setIsAuthenticated(false);
        }
    }, [token, userData]);

    // Login user
    const logInUser = async (payload) => {
        try {
            const response = await authService.loginUser(payload); // Get token and user data
            if (authService.isTokenExpired(response.token)) {
                console.warn("Returned token is expired. Handling session expiry.");
                handleSessionExpiry();
                return;
            }
            setToken(response.token); // Notify AppContext
        } catch (error) {
            console.error("Error during user login:", error);
        }
    };

    // Register user
    const registerUser = async (payload) => {
        try {
            const response = await authService.registerUser(payload);
            if (authService.isTokenExpired(response.token)) {
                console.warn("Returned token is expired. Handling session expiry.");
                handleSessionExpiry();
                return;
            }
            setToken(response.token); // Notify AppContext
        } catch (error) {
            console.error("Error during user registration:", error);
        }
    };

    // Logout user
    const logOutUser = () => {
        try {
            authService.logoutUser(); // Clear token from authService
            setToken(null); // Notify AppContext
        } catch (error) {
            console.error("Error during user logout:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, logInUser, logOutUser, registerUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
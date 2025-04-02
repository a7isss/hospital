import React, { createContext, useContext, useState, useEffect } from "react";
import { AppContext } from "./AppContext";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const appContext = useContext(AppContext) || {};

    // Destructure the necessary properties from AppContext
    const {
        token = null,
        setToken = () => {},
        userData = null,
        handleSessionExpiry = () => {},
        fetchUserData = () => {},
        logInUser: logInUserFromAppContext = () => {},
        registerUser: registerUserFromAppContext = () => {}
    } = appContext;

    const [user, setUser] = useState(null); // Local state for user info
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Local state for authentication status

    // Sync with AppContext's `userData` and `token`
    useEffect(() => {
        console.log("UserContext -> AppContext Values Changed:", { token, userData });

        // Sync user state from AppContext's userData
        if (token && userData) {
            setUser(userData);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [token, userData]);

    // Handle user login
    const logInUser = async (payload) => {
        console.log("UserContext -> logInUser -> Initiating login...");
        try {
            // Delegate login to AppContext
            await logInUserFromAppContext(payload);
        } catch (error) {
            console.error("UserContext -> logInUser -> Error:", error);
            handleSessionExpiry(); // Clear session on login failure
        }
    };

    // Handle user registration
    const registerUser = async (payload) => {
        console.log("UserContext -> registerUser -> Initiating registration...");
        try {
            // Delegate registration to AppContext
            await registerUserFromAppContext(payload);
        } catch (error) {
            console.error("UserContext -> registerUser -> Error:", error);
            handleSessionExpiry(); // Clear session on registration failure
        }
    };

    // Handle user logout
    const logOutUser = () => {
        console.log("UserContext -> logOutUser -> Logging out...");
        setToken(null); // Clear token via AppContext
        setUser(null); // Clear user state
        setIsAuthenticated(false);
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, logInUser, logOutUser, registerUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
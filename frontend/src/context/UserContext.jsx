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
        fetchUserData, // Fetch user data from AppContext
    } = appContext;

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        console.log("UserContext -> AppContext Values Changed:", { token, userData });

        if (token && userData) {
            setUser(userData); // Sync user state with AppContext's userData
            setIsAuthenticated(true);
        } else {
            console.warn("Token or userData is missing. Resetting user state.");
            setUser(null); // Clear user state when logged out
            setIsAuthenticated(false);
        }
    }, [token, userData]);

    const logInUser = async (payload) => {
        try {
            // Assume AppContext handles the login logic
            console.log("UserContext -> Logging in user...");
            await fetchUserData(); // Notify AppContext to fetch user data
        } catch (error) {
            console.error("UserContext -> Error during user login:", error);
            handleSessionExpiry(); // Clear session on error
        }
    };

    const registerUser = async (payload) => {
        try {
            // AppContext should handle token saving
            console.log("UserContext -> Registering user...");
            await fetchUserData(); // Reload user data
        } catch (error) {
            console.error("UserContext -> Error during user registration:", error);
            handleSessionExpiry();
        }
    };

    const logOutUser = () => {
        console.log("UserContext -> Logging out user...");
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
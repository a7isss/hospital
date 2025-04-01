import React, { createContext, useState } from "react";
import authService from '../services/authService'; // Import the authService

// Create User Context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state to store user info
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth status

    // Log in a user
    const logInUser = (userData) => {
        setUser(userData);
        setIsAuthenticated(true); // Set authenticated status
        localStorage.setItem("user", JSON.stringify(userData)); // Persist user info
    };

    // Log out a user
    const logOutUser = () => {
        setUser(null);
        setIsAuthenticated(false); // Clear authenticated status
        localStorage.removeItem("user"); // Clear user data from storage
    };

    // Register a user
    const registerUser = async (payload) => {
        const response = await authService.registerUser(payload);
        if (response) {
            setUser(response.user); // Update user state with the registered user data
            setIsAuthenticated(true); // Set authenticated status
            localStorage.setItem("user", JSON.stringify(response.user)); // Persist user info
        }
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, logInUser, logOutUser, registerUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
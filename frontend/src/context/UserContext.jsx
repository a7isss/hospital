import React, { createContext, useState } from "react";

// Create User Context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state to store user info

    // Log in a user (could store all the user-related data here)
    const logInUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Persist user info
    };

    // Log out a user
    const logOutUser = () => {
        setUser(null);
        localStorage.removeItem("user"); // Clear user data from storage
    };

    return (
        <UserContext.Provider value={{ user, logInUser, logOutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
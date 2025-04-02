import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const VisitorContext = createContext();

export const VisitorProvider = ({ children }) => {
    const [visitorId, setVisitorId] = useState(() => {
        // Initialize visitorId from localStorage
        return localStorage.getItem("visitorID");
    });

    useEffect(() => {
        const initializeVisitorId = async () => {
            if (!visitorId) {
                try {
                    // Fetch or generate a new visitorId from the backend
                    const response = await axiosInstance.post("/api/visitor/create");
                    const newVisitorId = response?.headers["x-visitor-id"];
                    if (newVisitorId) {
                        setVisitorId(newVisitorId);
                        localStorage.setItem("visitorID", newVisitorId); // Store the visitorId locally
                    }
                } catch (error) {
                    console.error("Error initializing visitor session:", error);
                }
            }
        };

        initializeVisitorId();
    }, [visitorId]);

    // Function to clear visitor ID (e.g., when switching to authenticated session)
    const clearVisitorId = () => {
        setVisitorId(null);
        localStorage.removeItem("visitorID");
    };

    return (
        <VisitorContext.Provider value={{ visitorId, setVisitorId, clearVisitorId }}>
            {children}
        </VisitorContext.Provider>
    );
};
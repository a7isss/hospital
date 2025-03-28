import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const VisitorContext = createContext();

export const VisitorProvider = ({ children }) => {
    const [visitorId, setVisitorId] = useState(() => {
        // Initialize visitorId from local storage or create a new one
        const storedVisitorId = localStorage.getItem("visitorID");
        return storedVisitorId ? storedVisitorId : uuidv4(); // Generate new ID if none exists
    });

    useEffect(() => {
        // Store the visitor ID in local storage
        localStorage.setItem("visitorID", visitorId);
    }, [visitorId]);

    return (
        <VisitorContext.Provider value={{ visitorId, setVisitorId }}>
            {children}
        </VisitorContext.Provider>
    );
};

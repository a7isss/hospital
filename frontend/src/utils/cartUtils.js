// Updated src/utils/cartUtils.js

// Get visitor ID directly (no more temporary creation)
export const getVisitorId = () => {
    return sessionStorage.getItem("visitor-id") || null; // Only use stored visitor ID
};

// Save visitor ID to sessionStorage
export const saveVisitorId = (visitorId) => {
    sessionStorage.setItem("visitor-id", visitorId);
};
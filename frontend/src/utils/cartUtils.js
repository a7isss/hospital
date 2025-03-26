// src/utils/cartUtils.js
// Handles visitor-id management only

// Get visitor ID from sessionStorage or generate it if unused
export const getVisitorId = () => {
    let visitorId = sessionStorage.getItem("visitor-id");

    if (!visitorId) {
        visitorId = "TEMP_VISITOR"; // Let backend generate a real visitor-id
        sessionStorage.setItem("visitor-id", visitorId); // Store for future API calls
    }

    return visitorId;
};
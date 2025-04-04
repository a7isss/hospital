import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Zustand store for visitor management
const useVisitorStore = create((set, get) => ({
    visitorId: localStorage.getItem("visitorID") || null, // Fetch visitor ID from localStorage or initialize as null

    // Generate and persist a visitor ID
    generateVisitorId: () => {
        let visitorId = get().visitorId; // Check if there's already a visitor ID

        if (!visitorId) {
            visitorId = uuidv4(); // Generate new UUID using uuid library
            localStorage.setItem("visitorID", visitorId); // Save to localStorage
            set({ visitorId }); // Update state
        }

        return visitorId; // Return the newly created or existing visitor ID
    },

    // Clear visitor ID (for logout or session reset)
    clearVisitorId: () => {
        localStorage.removeItem("visitorID"); // Remove from localStorage
        set({ visitorId: null }); // Clear from state
    },
}));

export default useVisitorStore;
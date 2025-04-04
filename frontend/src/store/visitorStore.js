import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";

const useVisitorStore = create((set, get) => ({
    visitorId: localStorage.getItem("visitorID") || null,

    // Generate and persist a visitor ID
    generateVisitorId: () => {
        let visitorId = get().visitorId;

        if (!visitorId) {
            visitorId = uuidv4();
            localStorage.setItem("visitorID", visitorId);
            set({ visitorId });
        }

        return visitorId;
    },

    // Load services (example for unprotected APIs)
    fetchServices: async () => {
        try {
            const response = await axiosInstance.get("/api/services"); // No token needed
            return response.data;
        } catch (error) {
            console.error("visitorStore -> fetchServices failed:", error);
            throw error;
        }
    },

    // Manage visitor-specific state
    cart: [],
    addToCart: (item) =>
        set((state) => ({
            cart: [...state.cart, item],
        })),
    clearCart: () => set({ cart: [] }),

    // Clear visitor ID (logout or reset)
    clearVisitorId: () => {
        localStorage.removeItem("visitorID");
        set({ visitorId: null, cart: [] });
    },
}));

export default useVisitorStore;
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
    // State variables for services
    services: [],
    loading: false,
    error: null,

    // Fetch services from the API and update the store
    fetchServices: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("/api/services"); // No token required
            set({ services: response.data.services, loading: false, error: null }); // Update services state
        } catch (error) {
            console.error("visitorStore -> fetchServices failed:", error.message);
            set({ loading: false, error: error.message });
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
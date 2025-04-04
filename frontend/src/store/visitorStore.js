import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import Fetcher from "../services/Fetcher"; // Import Fetcher for database access

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

    // State variables
    services: [], // Stores fetched services
    loading: false,
    error: null, // For handling fetch errors

    // Fetch all services and update store
    fetchServices: async () => {
        set({ loading: true, error: null });
        try {
            // Fetch services from the Fetcher utility
            const services = await Fetcher.fetchServices();
            set({ services, loading: false, error: null }); // Update store with fetched services
        } catch (error) {
            console.error("visitorStore -> fetchServices failed:", error.message);
            set({ loading: false, error: error.message }); // Update error state
        }
    },

    // Fetch service by ID and return it (doesn't alter store state)
    fetchServiceById: async (id) => {
        set({ loading: true, error: null });
        try {
            const service = await Fetcher.fetchServiceById(id);
            set({ loading: false, error: null });
            return service;
        } catch (error) {
            console.error("visitorStore -> fetchServiceById failed:", error.message);
            set({ loading: false, error: error.message });
            throw error; // Re-throw error for component-level handling
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
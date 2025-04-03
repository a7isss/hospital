import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set, get) => ({
    // ====================
    // State Variables
    // ====================
    token: authService.getToken(), // Token from local storage
    userData: null, // User data (profile) stored globally
    visitorId: localStorage.getItem("visitorID") || null, // Visitor ID for non-authenticated users
    isAuthenticated: !!authService.getToken(), // Whether the user is authenticated
    loading: false, // Global loading state
    error: null, // Global error states
    services: [], // List of services fetched from the API
    subscriptions: [], // List of user's subscriptions
    appointments: [], // List of appointments
    cart: [], // User or visitor's cart
    totalPrice: 0, // Total cart price

    // ====================
    // Authentication Methods
    // ====================
    loginUser: async (credentials) => {
        set({ loading: true });
        try {
            await authService.loginUser(credentials); // Handle login and manage tokens
            const userData = await authService.getUserData(); // Fetch user details post-login
            set({ userData, token: authService.getToken(), isAuthenticated: true, error: null });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    registerUser: async (userDetails) => {
        set({ loading: true });
        try {
            await authService.registerUser(userDetails);
            const userData = await authService.getUserData(); // Fetch user profile after registration
            set({ userData, token: authService.getToken(), isAuthenticated: true, error: null });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    logoutUser: async () => {
        try {
            authService.logoutUser(); // Clear tokens
            set({ token: null, userData: null, isAuthenticated: false, cart: [], totalPrice: 0 });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    },

    logoutFromAllDevices: async () => {
        set({ loading: true });
        try {
            await authService.logoutAllDevices();
            set({ token: null, userData: null, isAuthenticated: false, cart: [], totalPrice: 0 });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // ====================
    // Cart Operations
    // ====================
    initializeVisitorCart: async () => {
        const { visitorId } = get();
        if (!visitorId) return; // Ensure visitor ID is present

        set({ loading: true });
        try {
            const cart = await authService.fetchCartFromServer(visitorId); // Fetch cart from backend
            set({ cart: cart.items, totalPrice: cart.totalPrice, error: null });
        } catch (error) {
            set({ error: error.message, cart: [], totalPrice: 0 });
        } finally {
            set({ loading: false });
        }
    },

    loadCart: () => {
        const { cart, totalPrice } = authService.loadCart(); // Local storage cart loading
        set({ cart, totalPrice });
    },

    saveCart: async () => {
        const { cart, totalPrice, visitorId } = get();
        authService.saveCart(cart, totalPrice); // Save cart locally
        if (visitorId) {
            try {
                await authService.saveCartToServer(visitorId, { cart, totalPrice }); // Sync cart with backend
            } catch (error) {
                console.error("Failed to sync cart:", error.message);
            }
        }
    },

    addToCart: (item) => {
        if (!item?.price || !item?.itemId) return; // Validate item

        set((state) => {
            const existingItem = state.cart.find((i) => i.itemId === item.itemId);
            const updatedCart = existingItem
                ? state.cart.map((i) =>
                    i.itemId === item.itemId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
                : [...state.cart, { ...item, quantity: 1 }];

            const newTotalPrice = updatedCart.reduce(
                (total, i) => total + i.price * i.quantity,
                0
            );

            return { cart: updatedCart, totalPrice: newTotalPrice };
        });

        get().saveCart(); // Save to local storage and backend
    },

    updateCartItemQuantity: (itemId, newQuantity) => {
        set((state) => {
            const updatedCart = state.cart.map((item) =>
                item.itemId === itemId ? { ...item, quantity: newQuantity } : item
            );

            const newTotalPrice = updatedCart.reduce(
                (total, i) => total + i.price * i.quantity,
                0
            );

            return { cart: updatedCart, totalPrice: newTotalPrice };
        });

        get().saveCart(); // Save to local storage and backend
    },

    // ====================
    // Service and Appointment Management
    // ====================
    fetchServices: async () => {
        set({ loading: true });
        try {
            const services = await authService.getServices(); // Fetch list of services
            set({ services, error: null });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchAppointments: async () => {
        set({ loading: true });
        try {
            const appointments = await authService.getAppointments();
            set({ appointments, error: null });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
}));

export default useAuthStore;
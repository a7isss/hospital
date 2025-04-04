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

        if (!visitorId) return; // Ensure the visitor ID is available before proceeding

        set({ loading: true }); // Show loading indicator
        try {
            // Fetch the cart from the server using the updated authService method
            const cart = await authService.fetchCartFromServer(visitorId);

            // Update the state with the fetched cart
            set({
                cart, // Array of cart items
                totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0), // Calculate total price
                error: null, // Clear any previous errors
            });
        } catch (error) {
            // Handle error (e.g., if cart is not found)
            set({
                cart: [], // Reset cart to empty
                totalPrice: 0, // Reset total price
                error: error.message, // Set the error message
            });
        } finally {
            set({ loading: false }); // Hide loading indicator
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
    // Users , Service and Appointment Management
    // ====================
    fetchUserData: async () => {
        set({ loading: true }); // Set loading state
        try {
            const userData = await authService.getUserData(); // Fetch user data
            set({ userData, error: null }); // Update state with fetched user data
        } catch (error) {
            set({ error: error.message }); // Handle error
        } finally {
            set({ loading: false }); // Reset loading state
        }
    },

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
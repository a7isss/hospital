import { create } from 'zustand';
import authService from '../services/authService';
import axiosInstance from '../utils/axiosInstance';

const useAuthStore = create((set, get) => ({
    // State variables
    token: authService.getToken(), // Initialize token from local storage
    userData: null, // User data
    visitorId: localStorage.getItem("visitorID") || null, // Visitor ID (for unauthenticated users)
    isAuthenticated: !!authService.getToken(), // Authenticated status based on token
    loading: false, // Loading state
    error: null, // Error state
    services: [], // List of global services
    doctors: [], // List of global doctors
    currencySymbol: "₹", // Global currency symbol
    backendUrl: import.meta.env.VITE_BACKEND_URL, // Backend API URL

    // Handle session expiration
    handleSessionExpiry: () => {
        console.warn("authStore -> Handling session expiry.");
        authService.logoutUser(); // Clear stored tokens
        set({ token: null, userData: null, isAuthenticated: false });
        get().initializeVisitor(); // Revert to visitor mode after logout
    },

    // Initialize visitor (only for unauthenticated users)
    initializeVisitor: async () => {
        if (get().visitorId) return; // Skip if visitor ID already exists

        try {
            const response = await axiosInstance.post('/api/visitor/create');
            const newVisitorId = response?.headers["x-visitor-id"];
            if (newVisitorId) {
                localStorage.setItem("visitorID", newVisitorId);
                set({ visitorId: newVisitorId });
                console.log("authStore -> Visitor initialized with ID:", newVisitorId);
            }
        } catch (error) {
            console.error("authStore -> Failed to initialize visitor session:", error);
        }
    },

    // Clear visitor data when switching to an authenticated session
    clearVisitorData: () => {
        console.warn("authStore -> Clearing visitor data.");
        localStorage.removeItem("visitorID");
        set({ visitorId: null });
    },

    // Fetch the current user's data
    fetchUserData: async () => {
        const token = get().token;
        if (!token || authService.isTokenExpired(token)) {
            console.warn("authStore -> Invalid or expired token. Logging out.");
            get().handleSessionExpiry();
            return;
        }
        try {
            set({ loading: true, error: null });
            const { user } = await authService.getProfile(); // Fetch user profile from backend
            set({ userData: user, isAuthenticated: true });
            console.log("authStore -> Fetched user data:", user);
        } catch (error) {
            console.error("authStore -> Error fetching user data:", error);
            get().handleSessionExpiry();
        } finally {
            set({ loading: false });
        }
    },

    // Log in a user
    logInUser: async (payload) => {
        try {
            set({ loading: true, error: null });
            const { token } = await authService.loginUser(payload); // Log in via authService

            if (!token || authService.isTokenExpired(token)) {
                console.warn("authStore -> Received expired or invalid token.");
                get().handleSessionExpiry();
                return;
            }

            // Store token and fetch user data
            authService.setToken(token);
            set({ token, isAuthenticated: true });

            // Clear visitor state post-login
            get().clearVisitorData();

            await get().fetchUserData(); // Fetch authenticated user data
        } catch (error) {
            console.error("authStore -> Error during login:", error);
            set({ error: "Failed to log in. Please check your credentials." });
        } finally {
            set({ loading: false });
        }
    },

    // Register a user
    registerUser: async (payload) => {
        try {
            set({ loading: true, error: null });
            const { token } = await authService.registerUser(payload); // Register via authService

            if (!token || authService.isTokenExpired(token)) {
                console.warn("authStore -> Received expired or invalid token.");
                get().handleSessionExpiry();
                return;
            }

            // Store token and fetch user data
            authService.setToken(token);
            set({ token, isAuthenticated: true });

            // Clear visitor state post-registration
            get().clearVisitorData();

            await get().fetchUserData(); // Fetch authenticated user data
        } catch (error) {
            console.error("authStore -> Error during registration:", error);
            set({ error: "Failed to register. Please try again." });
        } finally {
            set({ loading: false });
        }
    },

    // Log out the user
    logOutUser: () => {
        console.log("authStore -> Logging out user.");
        authService.logoutUser(); // Clear all stored tokens
        set({ token: null, userData: null, isAuthenticated: false });
        get().initializeVisitor(); // Revert to visitor mode upon logout
    },

    // Fetch global services (e.g., for cart or display)
    fetchServices: async () => {
        try {
            set({ servicesLoading: true });
            const { data } = await axiosInstance.get('/api/services');
            set({ services: data });
            console.log("authStore -> Services fetched successfully.");
        } catch (error) {
            console.error("authStore -> Error fetching services:", error);
        } finally {
            set({ servicesLoading: false });
        }
    }
}));

export default useAuthStore;
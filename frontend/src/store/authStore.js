import { create } from "zustand";
import authService from "../services/authService";
import axiosInstance from "../utils/axiosInstance";

const useAuthStore = create((set, get) => ({
    // State variables
    token: authService.getToken(), // Initialize token from local storage
    userData: null, // Store user data globally
    visitorId: localStorage.getItem("visitorID") || null, // Visitor's ID for non-authenticated users
    isAuthenticated: !!authService.getToken(), // Check if the user is authenticated
    loading: false, // Global loading state
    error: null, // Global error state
    services: [], // List of services from the API
    doctors: [], // List of doctors from the API
    subscriptions: [], // List of user's subscriptions
    appointments: [], // List of user's appointments
    currencySymbol: "₹", // Global currency symbol (default to ₹)
    backendUrl: import.meta.env.VITE_BACKEND_URL, // Backend API URL

    // ====================
    // Actions and Methods
    // ====================

    // Set functions for managing state
    setToken: (token) => set({ token }),
    setUserData: (user) => set({ userData: user }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setServices: (services) => set({ services }),
    setDoctors: (doctors) => set({ doctors }),
    setSubscriptions: (subscriptions) => set({ subscriptions }),
    setAppointments: (appointments) => set({ appointments }),

    // Handle session expiration
    handleSessionExpiry: () => {
        console.warn("authStore -> Handling session expiry.");
        authService.logoutUser(); // Remove tokens and session data
        set({ token: null, userData: null, isAuthenticated: false, subscriptions: [], appointments: [] });
        get().initializeVisitor(); // Fallback to visitor mode
    },

    // Initialize visitor (for non-authenticated users)
    initializeVisitor: async () => {
        if (get().visitorId) {
            return; // If already initialized, skip
        }

        try {
            const response = await axiosInstance.post("/api/visitor/create");
            const newVisitorId = response?.headers["x-visitor-id"];
            if (newVisitorId) {
                localStorage.setItem("visitorID", newVisitorId);
                set({ visitorId: newVisitorId });
                console.log("authStore -> Visitor initialized with ID:", newVisitorId);
            }
        } catch (error) {
            console.error("authStore -> Failed to initialize visitor:", error);
            set({ error: "Failed to initialize a visitor session." });
        }
    },

    // Fetch current user data from the backend
    fetchUserData: async () => {
        const token = get().token;
        if (!token || authService.isTokenExpired(token)) {
            console.warn("authStore -> Invalid or expired token. Logging out.");
            get().handleSessionExpiry();
            return;
        }

        try {
            set({ loading: true, error: null });
            const { user } = await authService.getProfile(); // Fetches user info from the API
            set({ userData: user, isAuthenticated: true });
            console.log("authStore -> Fetched user data:", user);
        } catch (error) {
            console.error("authStore -> Error fetching user data:", error);
            get().handleSessionExpiry();
        } finally {
            set({ loading: false });
        }
    },

    // Fetch services globally
    fetchServices: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`${get().backendUrl}/api/services`);
            set({ services: response.data.services || [], error: null });
        } catch (error) {
            console.error("authStore -> Error fetching services:", error);
            set({ error: "Failed to fetch services. Please try again later." });
        } finally {
            set({ loading: false });
        }
    },

    // Fetch doctors globally
    fetchDoctors: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`${get().backendUrl}/api/doctors`);
            set({ doctors: response.data.doctors || [], error: null });
        } catch (error) {
            console.error("authStore -> Error fetching doctors:", error);
            set({ error: "Failed to fetch doctors. Please try again later." });
        } finally {
            set({ loading: false });
        }
    },

    // Fetch subscriptions for authenticated users
    fetchSubscriptions: async () => {
        const { token, userData } = get();
        if (!userData || !token) {
            console.warn("authStore -> No authenticated user. Skipping subscriptions fetch.");
            set({ subscriptions: [] });
            return;
        }

        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`${get().backendUrl}/api/subscriptions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ subscriptions: response.data.subscriptions || [], error: null });
        } catch (error) {
            console.error("authStore -> Error fetching subscriptions:", error);
            set({ error: "Failed to fetch subscriptions. Please try again later." });
        } finally {
            set({ loading: false });
        }
    },

    // Fetch appointments for authenticated users
    fetchAppointments: async () => {
        const { token } = get();
        if (!token) {
            console.warn("authStore -> No authenticated user. Skipping appointments fetch.");
            set({ appointments: [] });
            return;
        }

        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`${get().backendUrl}/api/user/appointments`, {
                headers: { token },
            });
            set({ appointments: response.data.appointments.reverse() || [] }); // Reverse to show latest first
        } catch (error) {
            console.error("authStore -> Error fetching appointments:", error);
            set({ error: "Failed to fetch appointments. Please try again later." });
        } finally {
            set({ loading: false });
        }
    },

    // Log user in
    logInUser: async (payload) => {
        try {
            set({ loading: true, error: null });
            const { token } = await authService.loginUser(payload); // Perform login
            if (!token || authService.isTokenExpired(token)) {
                console.warn("authStore -> Received expired or invalid token.");
                get().handleSessionExpiry();
                return;
            }

            authService.setToken(token); // Store token
            set({ token, isAuthenticated: true });

            get().clearVisitorData(); // Clear visitor state after login
            await get().fetchUserData(); // Fetch authenticated user data
        } catch (error) {
            console.error("authStore -> Error during login:", error);
            set({ error: "Failed to log in. Please check your credentials." });
        } finally {
            set({ loading: false });
        }
    },

    // Register a new user
    registerUser: async (payload) => {
        try {
            set({ loading: true, error: null });
            const { token } = await authService.registerUser(payload); // Perform registration

            if (!token || authService.isTokenExpired(token)) {
                console.warn("authStore -> Received expired or invalid token.");
                get().handleSessionExpiry();
                return;
            }

            authService.setToken(token); // Store token for immediate login
            set({ token, isAuthenticated: true });

            get().clearVisitorData(); // Clear visitor state after signup
            await get().fetchUserData(); // Fetch authenticated user data
        } catch (error) {
            console.error("authStore -> Error during registration:", error);
            set({ error: "Failed to register. Please try again later." });
        } finally {
            set({ loading: false });
        }
    },

    // Clear visitor data when switching to an authenticated session
    clearVisitorData: () => {
        console.warn("authStore -> Clearing visitor data.");
        localStorage.removeItem("visitorID");
        set({ visitorId: null });
    },
}));

export default useAuthStore;
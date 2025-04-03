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
    // Cart States
    // ====================
    cart: [],
    totalPrice: 0,

    // ====================
    // Actions and Methods
    // ====================
// Watcher: Reload cart when visitorId changes
    initializeVisitorCartWatcher: () => {
        // Run this effect as a watcher when visitorId changes
        const { visitorId } = get();
        if (visitorId) {
            get().loadCart(); // Load cart for the newly initialized visitor
            console.log("authStore -> Visitor cart initialized for visitorId:", visitorId);
        }
    },
    // =========================
    // Cart Operations
    // =========================

    // Load Cart from Local Storage
    loadCart: () => {
        const cartKey = get().getCartKey(); // Key depends on visitorId or userData
        try {
            const savedCart = localStorage.getItem(cartKey);
            const savedPrice = localStorage.getItem(`${cartKey}_totalPrice`);

            set({
                cart: savedCart ? JSON.parse(savedCart) : [],
                totalPrice: savedPrice ? parseFloat(savedPrice) : 0,
            });
            console.log("authStore -> Cart loaded successfully:", { cartKey });
        } catch (error) {
            console.error("authStore -> Error loading cart:", error);
            set({ cart: [], totalPrice: 0 });
        }
    },

    // Save Cart to Local Storage
    saveCart: () => {
        const { cart, totalPrice } = get();
        const cartKey = get().getCartKey();

        try {
            localStorage.setItem(cartKey, JSON.stringify(cart));
            localStorage.setItem(`${cartKey}_totalPrice`, totalPrice.toString());
        } catch (error) {
            console.error("authStore -> Error saving cart:", error);
        }
    },

    // Add Item to Cart
    addToCart: (item) => {
        if (!item?.price || !item?.itemId) return; // Validate required fields

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

        get().saveCart(); // Save cart to local storage
    },

    // Update Item Quantity
    updateCartQuantity: (itemId, newQuantity) => {
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

        get().saveCart(); // Save cart to local storage
    },

    // Remove Item from Cart
    removeFromCart: (itemId) => {
        set((state) => {
            const updatedCart = state.cart.filter((item) => item.itemId !== itemId);

            const newTotalPrice = updatedCart.reduce(
                (total, i) => total + i.price * i.quantity,
                0
            );

            return { cart: updatedCart, totalPrice: newTotalPrice };
        });

        get().saveCart(); // Save changes to local storage
    },

    // Recalculate Cart Total
    recalculateTotalPrice: () => {
        const { cart } = get();
        const newTotalPrice = cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        set({ totalPrice: newTotalPrice });
    },

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
        authService.logoutUser();
        set({
            token: null,
            userData: null,
            isAuthenticated: false,
            subscriptions: [],
            appointments: [],
            cart: [],
            totalPrice: 0,
        });
        get().initializeVisitor();
    },


    // Initialize visitor (for non-authenticated users)
    initializeVisitor: async () => {
        const { visitorId } = get();
        if (visitorId) {
            // No need to reinitialize if visitorId already exists
            return;
        }

        try {
            const response = await axiosInstance.post("/api/visitor/create");
            const newVisitorId = response?.headers["x-visitor-id"];
            if (newVisitorId) {
                localStorage.setItem("visitorID", newVisitorId);
                set({ visitorId: newVisitorId });
                console.log("authStore -> Visitor initialized with ID:", newVisitorId);
                get().initializeVisitorCartWatcher(); // Load cart for new visitor
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
import axiosInstance from "../utils/axiosInstance.js";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/`;
const CART_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cart/`;

const authService = {
    // ==================
    // Token Management
    // ==================
    getToken: () => localStorage.getItem("token"),
    setToken: (token) => localStorage.setItem("token", token),
    clearToken: () => localStorage.removeItem("token"),
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setRefreshToken: (refreshToken) => localStorage.setItem("refreshToken", refreshToken),
    clearRefreshToken: () => localStorage.removeItem("refreshToken"),
    isTokenExpired: (token) => {
        if (!token) return true;
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= exp * 1000;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return true;
        }
    },

    // ==================
    // Reusable Requests
    // ==================
    makeAuthRequest: async (method, endpoint, data = null, baseURL = API_URL) => {
        const token = authService.getToken();
        if (!token || authService.isTokenExpired(token)) {
            throw new Error("Authentication failed. Please log in again.");
        }
        try {
            const response = await axiosInstance({
                method,
                url: `${baseURL}${endpoint}`,
                data,
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error(`Error with request to ${endpoint}:`, err);
            throw err;
        }
    },

    // ==================
    // Authentication Methods
    // ==================
    loginUser: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}login`, payload);
        if (response.data.token) {
            authService.setToken(response.data.token);
            if (response.data.refreshToken) {
                authService.setRefreshToken(response.data.refreshToken);
            }
        }
        return response.data;
    },

    registerUser: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}register`, payload);
        if (response.data.token) {
            authService.setToken(response.data.token);
            if (response.data.refreshToken) {
                authService.setRefreshToken(response.data.refreshToken);
            }
        }
        return response.data;
    },

    refreshToken: async () => {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
            throw new Error("No refresh token available. Please log in again.");
        }
        const response = await axiosInstance.post(`${API_URL}refresh-token`, { refreshToken });
        authService.setToken(response.data.token);
        return response.data;
    },

    logoutUser: () => {
        authService.clearToken();
        authService.clearRefreshToken();
    },

    logoutAllDevices: async () => {
        await authService.makeAuthRequest("POST", "logout/all", {});
        authService.logoutUser();
    },

    // ==================
    // Cart Management
    // ==================
    fetchCartFromServer: async (visitorId) => {
        try {
            // Call the updated getVisitorCart endpoint
            const response = await axiosInstance.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/visitor/${visitorId}/cart`
            );
            return response.data.cart; // Return the cart data only
        } catch (error) {
            console.error("Failed to fetch visitor's cart from server:", error.message);
            throw error; // Propagate the error to handle it in `authStore`
        }
    },
    saveCartToServer: async (visitorId, cartData) => {
        return await authService.makeAuthRequest("POST", "save", { visitorId, cartData }, CART_URL);
    },

    loadCart: () => {
        const cartKey = localStorage.getItem("visitorID") || "guest_cart";
        try {
            return {
                cart: JSON.parse(localStorage.getItem(cartKey)) || [],
                totalPrice: parseFloat(localStorage.getItem(`${cartKey}_totalPrice`)) || 0,
            };
        } catch (error) {
            console.error("Error loading cart:", error);
            return { cart: [], totalPrice: 0 };
        }
    },

    saveCart: (cart, totalPrice) => {
        const cartKey = localStorage.getItem("visitorID") || "guest_cart";
        try {
            localStorage.setItem(cartKey, JSON.stringify(cart));
            localStorage.setItem(`${cartKey}_totalPrice`, totalPrice.toString());
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    },

    // ==================
    // Appointments and Services
    // ==================
    getServices: async () => {
        return await authService.makeAuthRequest("GET", "services");
    },

    getAppointments: async () => {
        return await authService.makeAuthRequest("GET", "appointments");
    },


    // ==================
    // [fetch user data]
    // ==================

    getUserData: async () => {
        const token = this.getToken(); // Get the token from local storage
        if (!token) {
            throw new Error("User is not authenticated.");
        }
        try {
            const response = await axiosInstance.get(`${API_URL}profile`, {
                headers: { Authorization: `Bearer ${token}` }, // Include the token in the request headers
            });
            return response.data; // Return the user data
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            throw error; // Propagate the error
        }
    },
};
export default authService;
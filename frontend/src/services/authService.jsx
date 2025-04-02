import axiosInstance from "../utils/axiosInstance";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/`;

const authService = {
    // Utility functions for token management
    getToken: () => localStorage.getItem("token"),
    setToken: (token) => localStorage.setItem("token", token),
    clearToken: () => localStorage.removeItem("token"),

    // Helper to check token expiry
    isTokenExpired: (token) => {
        if (!token) return true;
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            return Date.now() >= exp * 1000; // Compare current time to expiry
        } catch (error) {
            console.error("Failed to decode or validate token:", error);
            return true; // Treat as expired if decoding fails
        }
    },

    // Login
    loginUser: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}login`, payload);
        if (response.data.token) {
            authService.setToken(response.data.token); // Save token
        }
        return response.data;
    },

    // Register
    registerUser: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}register`, payload);
        if (response.data.token) {
            authService.setToken(response.data.token); // Save token
        }
        return response.data;
    },

    // Logout
    logoutUser: () => {
        authService.clearToken(); // Clear token from storage
    },

    // Fetch user profile (with token expiry validation)
    getProfile: async () => {
        const token = authService.getToken();
        if (authService.isTokenExpired(token)) {
            authService.clearToken();
            throw new Error("Token expired. Please log in again.");
        }
        const response = await axiosInstance.get(`${API_URL}me`);
        return response.data; // Return fetched profile data
    },
};

export default authService;
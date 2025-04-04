import axiosInstance from "../utils/axiosInstance.js";
import useVisitorStore from "../store/visitorStore";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/`;

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
    // Reusable Requests only for Authenticated Users
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
    loginUser: async (credentials) => {
        const response = await axiosInstance.post(`${API_URL}login`, credentials);
        if (response.data.token) {
            authService.setToken(response.data.token);
            if (response.data.refreshToken) {
                authService.setRefreshToken(response.data.refreshToken);
            }
        }
        return response.data;
    },

    registerUser: async (userDetails) => {
        const response = await axiosInstance.post(`${API_URL}register`, userDetails);
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

    logoutFromAllDevices: async () => {
        await authService.makeAuthRequest("POST", "logout/all", {});
        authService.logoutUser();
    },

    // ==================
    // Authenticated-Only Operations
    // ==================
    getServices: async () => {
        // Fetch services specifically for authenticated users
        return await authService.makeAuthRequest("GET", "services");
    },

    getAppointments: async () => {
        return await authService.makeAuthRequest("GET", "appointments");
    },

    getUserData: async () => {
        const token = authService.getToken();
        if (!token) {
            throw new Error("User is not authenticated.");
        }
        try {
            const response = await axiosInstance.get(`${API_URL}profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data; // Returns user details.
        } catch (err) {
            console.error("getUserData -> Error fetching user data:", err);
            throw err;
        }
    },
};

export default authService;
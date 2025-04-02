import axiosInstance from "../utils/axiosInstance.js";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/`;

const authService = {
    // Utility functions for token management
    getToken: () => localStorage.getItem("token"),
    setToken: (token) => localStorage.setItem("token", token),
    clearToken: () => localStorage.removeItem("token"),

    // Refresh token management
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setRefreshToken: (refreshToken) => localStorage.setItem("refreshToken", refreshToken),
    clearRefreshToken: () => localStorage.removeItem("refreshToken"),

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
        const response = await axiosInstance.post(`${API_URL}/login`, payload);
        if (response.data.token) {
            authService.setToken(response.data.token); // Save access token
            if (response.data.refreshToken) {
                authService.setRefreshToken(response.data.refreshToken); // Save refresh token
            }
        }
        return response.data;
    },

    // Register
    registerUser: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}register`, payload);
        if (response.data.token) {
            authService.setToken(response.data.token); // Save access token
            if (response.data.refreshToken) {
                authService.setRefreshToken(response.data.refreshToken); // Save refresh token
            }
        }
        return response.data;
    },

    // Silent refresh to get a new token
    refreshToken: async () => {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
            throw new Error("Refresh token is missing. Please log in again.");
        }
        try {
            const response = await axiosInstance.post(`${API_URL}refresh-token`, { refreshToken });
            authService.setToken(response.data.token); // Save new access token
            return response.data;
        } catch (err) {
            console.error("Failed to refresh token:", err);
            authService.logoutUser(); // Clear session if refresh fails
            throw err;
        }
    },

    // Logout
    logoutUser: () => {
        authService.clearToken(); // Clear access token
        authService.clearRefreshToken(); // Clear refresh token
    },

    // Logout from all devices
    logoutAllDevices: async () => {
        const token = authService.getToken();
        if (!token) throw new Error("User is not logged in.");
        try {
            await axiosInstance.post(`${API_URL}logout/all`, {}, { headers: { Authorization: `Bearer ${token}` } });
            authService.logoutUser(); // Clear tokens locally
        } catch (err) {
            console.error("Error during logout from all devices:", err);
            throw err;
        }
    },

    // Enable Two-Factor Authentication (2FA)
    enable2FA: async () => {
        const token = authService.getToken();
        if (!token) throw new Error("User is not logged in.");
        try {
            const response = await axiosInstance.post(`${API_URL}2fa/enable`, {}, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; // Contains QR code data or secret key
        } catch (err) {
            console.error("Error enabling 2FA:", err);
            throw err;
        }
    },

    // Verify 2FA Code
    verify2FACode: async (otp) => {
        const token = authService.getToken();
        if (!token) throw new Error("User is not logged in.");
        try {
            const response = await axiosInstance.post(`${API_URL}2fa/verify`, { otp }, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; // Successfully verified or not
        } catch (err) {
            console.error("Error verifying 2FA code:", err);
            throw err;
        }
    },

    // Request password reset
    requestPasswordReset: async (email) => {
        try {
            const response = await axiosInstance.post(`${API_URL}password-reset/request`, { email });
            return response.data; // Success message sent to email
        } catch (err) {
            console.error("Error requesting password reset:", err);
            throw err;
        }
    },

    // Reset password
    resetPassword: async (payload) => {
        try {
            const response = await axiosInstance.post(`${API_URL}password-reset/reset`, payload);
            return response.data; // Success confirmation
        } catch (err) {
            console.error("Error resetting password:", err);
            throw err;
        }
    },

    // Verify user's email
    verifyEmail: async (token) => {
        try {
            const response = await axiosInstance.post(`${API_URL}email/verify`, { token });
            return response.data; // Successfully verified or not
        } catch (err) {
            console.error("Error verifying email:", err);
            throw err;
        }
    },

    // Fetch user profile (with token expiry validation)
    getProfile: async () => {
        const token = authService.getToken();
        if (authService.isTokenExpired(token)) {
            authService.clearToken();
            throw new Error("Token expired. Please log in again.");
        }
        const response = await axiosInstance.get(`${API_URL}me`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data; // Return fetched profile data
    },

    // Fetch user roles and permissions
    getUserRoles: async () => {
        const token = authService.getToken();
        if (!token) throw new Error("User is not logged in.");
        try {
            const response = await axiosInstance.get(`${API_URL}roles`, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; // Return array of roles/permissions
        } catch (err) {
            console.error("Error fetching user roles:", err);
            throw err;
        }
    },
};

export default authService;
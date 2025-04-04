import axios from "axios";
import authService from "../services/authService";
import useVisitorStore from "../store/visitorStore";

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = authService.getToken();
        const { visitorId, generateVisitorId } = useVisitorStore.getState();

        // Handle authenticated user token
        if (token) {
            if (authService.isTokenExpired(token)) {
                try {
                    const { token: newToken } = await authService.refreshToken();
                    if (newToken) {
                        config.headers.Authorization = `Bearer ${newToken}`;
                    }
                } catch (error) {
                    console.error("axiosInstance -> Token refresh failed:", error);
                    authService.logoutUser();
                    throw error;
                }
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } else {
            // Handle visitor ID for unauthenticated requests
            let id = visitorId;
            if (!id) {
                id = generateVisitorId();
            }
            config.headers["x-visitor-id"] = id; // Add visitorId to headers
        }

        return config;
    },
    (error) => {
        console.error("axiosInstance -> Request error:", error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response, // Return the response if no error
    (error) => {
        console.error("axiosInstance -> Response error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
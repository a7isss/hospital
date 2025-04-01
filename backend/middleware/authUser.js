import axios from 'axios';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/`; // Use the environment variable

const registerUser = async (payload) => {
    const response = await axios.post(`${API_URL}register`, payload);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
    }
    return response.data;
};

const loginUser = async (payload) => {
    const response = await axios.post(`${API_URL}login`, payload);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
    }
    return response.data;
};

const authService = {
    registerUser,
    loginUser,
};

export default authService;
import axios from 'axios';
const API_URL = `https://ph-1oub.onrender.com/api/`;
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
import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]); // State for all services
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
    const [userData, setUserData] = useState(false);

    // Fetch all services
    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/uservices`);
            if (data.success) {
                setServices(data.services); // Store services in state
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch services");
        }
    };

    // Fetch a single service by ID
    const fetchServiceById = async (id) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/uservices/${id}`);
            if (data.success) {
                return data.service; // Return the fetched service
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch the service");
            return null;
        }
    };

    useEffect(() => {
        fetchServices(); // Fetch all services on mount
    }, []);

    const value = {
        doctors,
        setDoctors,
        services,
        fetchServices,
        fetchServiceById, // Expose fetch by ID method
        currencySymbol,
        backendUrl,
        aToken,
        setAToken,
        userData,
        setUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
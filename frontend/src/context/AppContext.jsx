import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]); // New state for services
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [userData, setUserData] = useState(false);

    // Fetch services from the backend
    const fetchServices = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/uservices');
            if (data.success) {
                setServices(data.services); // Store services in state
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch services");
        }
    };

    useEffect(() => {
        fetchServices(); // Call fetchServices on load
    }, []);

    const value = {
        doctors,
        services, // Expose services to the context
        currencySymbol,
        backendUrl,
        fetchServices, // Allow refetching services if needed
        aToken, setAToken,
        userData, setUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
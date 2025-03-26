// src/pages/Services.jsx
import React, { useEffect, useState } from "react";
import ServiceCards from "../components/ServiceCards";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Services = () => {
  const { backendUrl } = useContext(AppContext); // Get backend URL from AppContext
  const [services, setServices] = useState([]); // State to store fetched services
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error before fetching
      const { data } = await axios.get(`${backendUrl}/api/services`); // Fetch data from backend
      console.log("Fetched services:", data.services);
      setServices(data.services); // Populate services state
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h1>

        {loading && <p>Loading services...</p>} {/* Loader */}
        {error && <p className="text-red-500">{error}</p>} {/* Error Message */}

        {/* Render ServiceCards Component */}
        {!loading && !error && <ServiceCards services={services} />}
      </div>
  );
};

export default Services;
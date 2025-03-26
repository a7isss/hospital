import React, { useEffect, useState } from "react";
import ServiceCards from "../components/ServiceCards";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Services = () => {
  const { backendUrl } = useContext(AppContext); // Access backend URL from AppContext
  const [services, setServices] = useState([]); // State for fetched services
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch services when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/services`);
        setServices(data.services || []);
      } catch (err) {
        console.error("Error loading services:", err);
        setError("Failed to load services. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [backendUrl]);

  return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && services.length === 0 && (
            <p className="text-center text-gray-500">No services available at the moment.</p>
        )}

        {!loading && !error && services.length > 0 && (
            <ServiceCards services={services} />
        )}
      </div>
  );
};

export default Services;
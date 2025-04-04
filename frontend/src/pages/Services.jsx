import React, { useEffect } from "react";
import ServiceCards from "../components/ServiceCards"; // Importing ServiceCards component
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore"; // Zustand's authStore

const Services = () => {
  const {
    backendUrl,
    services,
    setServices,
    loading,
    setLoading,
    error,
    setError,
  } = useAuthStore((state) => ({
    backendUrl: state.backendUrl,
    services: state.services,
    setServices: state.setServices,
    loading: state.loading,
    setLoading: state.setLoading,
    error: state.error,
    setError: state.setError,
  }));

  // Fetch services using Zustand for global state management
  const fetchServices = async () => {
    try {
      setLoading(true); // Set loading state globally
      const response = await fetch(`${backendUrl}/api/services`);
      const data = await response.json();

      if (response.ok) {
        setServices(data.services || []); // Populate global services state
        setError(null); // Clear error message upon success
      } else {
        throw new Error(data.message || "Failed to load services.");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Try again later."); // Update global error state
      toast.error("Error fetching services. Please try again.");
    } finally {
      setLoading(false); // Reset loading state globally
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    if (services.length === 0) fetchServices(); // Fetch only if not already loaded
  }, []);

  return (
      <div className="container mx-auto px-6 py-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>

        {/* Loading State */}
        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* No Services Available */}
        {!loading && !error && services.length === 0 && (
            <p className="text-center text-gray-500">
              No services available at the moment.
            </p>
        )}

        {/* Render Services */}
        {!loading && !error && services.length > 0 && (
            <ServiceCards services={services} /> // Using ServiceCards component
        )}
      </div>
  );
};

export default Services;

import React, { useEffect, useState } from "react";
import ServiceCards from "../components/ServiceCards";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore"; // Handles authenticated users
import useVisitorStore from "../store/visitorStore"; // Handles visitors

const Services = () => {
  const { isAuthenticated, services: authServices, fetchServices: fetchAuthServices } = useAuthStore(
      (state) => ({
        isAuthenticated: state.isAuthenticated,
        services: state.services,
        fetchServices: state.fetchServices, // Fetch services for authenticated users
      })
  );

  const { fetchServices: fetchVisitorServices } = useVisitorStore((state) => ({
    fetchServices: state.fetchServices, // Fetch services for visitors
  }));

  const [services, setServices] = useState([]); // Local state to display services
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch services based on user state (visitor or authenticated)
  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        // Authenticated user services
        console.log("Fetching authenticated user services...");
        await fetchAuthServices(); // Updates global authStore state
        setServices(authServices); // Use services from authStore
      } else {
        // Visitor services (default)
        console.log("Fetching visitor services...");
        const visitorServices = await fetchVisitorServices();
        setServices(visitorServices); // Use visitorStore's services
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again later.");
      toast.error("Error fetching services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
    // We include `isAuthenticated` in the dependency array to re-fetch services if the auth state changes
  }, [isAuthenticated]);

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
            <ServiceCards services={services} />
        )}
      </div>
  );
};

export default Services;
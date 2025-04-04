import React, { useEffect } from "react";
import ServiceCards from "../components/ServiceCards";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore"; // Handles authenticated users
import useVisitorStore from "../store/visitorStore"; // Handles visitors

const Services = () => {
  const { isAuthenticated, fetchServices: fetchAuthServices, services: authServices } = useAuthStore(
      (state) => ({
        isAuthenticated: state.isAuthenticated,
        fetchServices: state.fetchServices, // Fetch services action for authenticated users
        services: state.services, // Authenticated user services
      })
  );

  const { fetchServices: fetchVisitorServices, services: visitorServices } = useVisitorStore(
      (state) => ({
        fetchServices: state.fetchServices, // Fetch services action for visitors
        services: state.services, // Visitor services
      })
  );

  // Fetch services based on the authentication state
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (isAuthenticated) {
          await fetchAuthServices(); // Fetch services for authenticated users
        } else {
          await fetchVisitorServices(); // Fetch services for visitors
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        toast.error("Failed to load services. Please try again later.");
      }
    };

    fetchServices();
  }, [isAuthenticated, fetchAuthServices, fetchVisitorServices]);

  // Decide which services to display based on auth state
  const services = isAuthenticated ? authServices : visitorServices;

  return (
      <div className="container mx-auto px-6 py-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>

        {/* Render the ServiceCards component */}
        <ServiceCards services={services} />
      </div>
  );
};

export default Services;
import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // For translation
import { useNavigate } from "react-router-dom"; // For navigation
import FormSubmit from "../components/FormSubmit.jsx"; // Handles form submission
import useAuthStore from "../store/authStore"; // Zustand store for authentication

const Login = () => {
  const { t } = useTranslation(); // Initialize translation
  const navigate = useNavigate(); // Initialize navigation

  // Zustand state
  const logInUser = useAuthStore((state) => state.logInUser); // LogInUser from Zustand Store
  const userData = useAuthStore((state) => state.userData); // User data from Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Authenticated state
  const loading = useAuthStore((state) => state.loading); // Loading state

  // Local state for form
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login/register
  const [formData, setFormData] = useState({
    name: "", // Only required for registration
    phone: "", // Required for both
    age: "", // Only required for registration
    password: "", // Required for both login and registration
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    try {
      // Handle data submission (login/register)
      const responseData = await FormSubmit(formData, isRegistering);

      // Call Zustand's logInUser to update state after successful login
      if (!isRegistering) {
        await logInUser(responseData); // Pass response data to logInUser
      }

      console.log(responseData); // Debugging
      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("Submission failed:", error); // Handle errors
    }
  };

  return (
      <div className="container mx-auto p-4">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">
          {isAuthenticated
              ? t("Welcome Back, ") + userData?.name // If logged in, greet user
              : isRegistering
                  ? t("Register") // Registration mode
                  : t("Login")} // Login mode
        </h2>

        {/* Render user info if authenticated */}
        {isAuthenticated ? (
            <div className="p-4 bg-green-100 rounded-md shadow">
              <p className="font-medium">{t("Name")}: {userData?.name}</p>
              <p className="font-medium">{t("Phone")}: {userData?.phone}</p>
            </div>
        ) : (
            // Render login/register form when not authenticated
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone input field */}
              <input
                  type="tel"
                  name="phone"
                  placeholder={t("Phone Number")}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
              />

              {/* Show additional fields for registration */}
              {isRegistering && (
                  <>
                    <input
                        type="text"
                        name="name"
                        placeholder={t("Full Name")}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder={t("Age")}
                        value={formData.age}
                        onChange={handleInputChange}
                        min="10"
                        max="120"
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </>
              )}

              {/* Password input */}
              <input
                  type="password"
                  name="password"
                  placeholder={t("Password")}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
              />

              {/* Submit button */}
              <button
                  type="submit"
                  disabled={loading} // Disable during submission
                  className={`px-4 py-2 rounded-md shadow text-white ${
                      loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primary hover:bg-primary-dark"
                  }`}
              >
                {loading
                    ? t("Loading...") // Show loading text
                    : isRegistering
                        ? t("Register") // Show Register text
                        : t("Login")} // Show Login text
              </button>
            </form>
        )}

        {/* Switch between login and registration */}
        {!isAuthenticated && (
            <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary mt-4 underline"
            >
              {isRegistering
                  ? t("Already have an account? Login")
                  : t("Register Here")}
            </button>
        )}
      </div>
  );
};

export default Login;
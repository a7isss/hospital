import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import FormSubmit from "../components/FormSubmit.jsx"; // Import the FormSubmit component
import { AppContext } from "../context/AppContext"; // Import AppContext to manage authentication globally

const Login = () => {
  const { t } = useTranslation(); // Initialize translation
  const navigate = useNavigate(); // Initialize navigate for routing
  const { logInUser } = useContext(AppContext); // Extract logInUser from AppContext (or use any login method from context)

  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
  const [formData, setFormData] = useState({
    name: "", // Required only for registration
    phone: "", // Required for both login and registration
    age: "", // Required only for registration
    password: "", // Required for both registration and login
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
    e.preventDefault(); // Prevent default form submission

    console.log("isRegistering:", isRegistering); // Debugging to confirm whether logging in or registering

    try {
      // Call FormSubmit with the right API endpoint based on isRegistering
      const responseData = await FormSubmit(formData, isRegistering);

      // Log in the user using AppContext (if in logging-in mode)
      if (!isRegistering) {
        await logInUser(responseData); // Assume logInUser updates token/userData in AppContext
      }

      console.log(responseData); // Debugging the success response
      navigate("/"); // Redirect to home page after successful login/registration
    } catch (error) {
      console.error("Submission failed:", error); // Handle and log error response
    }
  };

  return (
      <div className="container mx-auto p-4">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? t("Register") : t("Login")}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone input field (Visible for both login and registration) */}
          <input
              type="tel"
              name="phone"
              placeholder={t("Phone Number")}
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md p-2 w-full"
          />

          {/* Fields only visible when the user is registering */}
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

          {/* Password field (Visible for both login and registration) */}
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
              className="bg-primary text-white px-4 py-2 rounded-md"
          >
            {isRegistering ? t("Register") : t("Login")}
          </button>
        </form>

        {/* Toggle between login and register */}
        <p className="mt-4">
          {isRegistering ? t("Already have an account?") : t("Need an account?")}
          <button
              type="button" // Avoid accidental form submission
              onClick={() => setIsRegistering(!isRegistering)} // Toggle the form state
              className="text-blue-500 ml-1"
          >
            {isRegistering ? t("Login Here") : t("Register Here")}
          </button>
        </p>
      </div>
  );
};

export default Login;
import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import FormSubmit from "../components/FormSubmit.jsx"; // Import the FormSubmit component

const Login = () => {
  const { t } = useTranslation(); // Initialize translation
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
  const [formData, setFormData] = useState({
    name: "", // Required only for registration
    phone: "", // Required for both login and registration
    age: "", // Required only for registration
    password: "", // Required for both registration and login
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await FormSubmit(formData, isRegistering);
      console.log(responseData); // Handle success response
    } catch (error) {
      console.error("Submission failed:", error); // Handle error response
    }
  };

  return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? t("Register") : t("Login")}
        </h2>
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

          <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md"
          >
            {isRegistering ? t("Register") : t("Login")}
          </button>
        </form>
        <p className="mt-4">
          {isRegistering ? t("Already have an account?") : t("Need an account?")}
          <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 ml-1"
          >
            {isRegistering ? t("Login Here") : t("Register Here")}
          </button>
        </p>
      </div>
  );
};

export default Login;
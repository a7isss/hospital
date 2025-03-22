import axios from 'axios';
import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

const Login = () => {
  // State for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Context for managing admin token
  const { setAToken } = useContext(AdminContext);

  // Form submission handler
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent default form behavior

    console.log("Attempting Admin Login:", { username, password, backendUrl });

    try {
      // Send login request to backend
      const { data } = await axios.post(
          `${backendUrl}/api/admin/login`,
          { username, password }, // Request payload
          { headers: { 'Content-Type': 'application/json' } } // Content-Type header
      );

      // Handle response
      console.log("Login Response:", data);

      if (data.success) {
        console.log("Admin token received:", data.aToken);
        setAToken(data.aToken); // Update context with token
        localStorage.setItem('aToken', data.aToken); // Save token to localStorage
        toast.success("Login successful!");
      } else {
        toast.error(data.message || "Invalid login attempt");
      }
    } catch (error) {
      console.error("Error during login:", error?.response || error?.message || error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
      <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">Admin</span> Login
          </p>
          <div className="w-full">
            <p>Username</p>
            <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                required
            />
          </div>
          <button className="bg-primary text-white w-full py-2 rounded-md text-base">
            Login
          </button>
        </div>
      </form>
  );
};

export default Login;
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { dToken, logout: doctorLogout } = useContext(DoctorContext); // Destructure logout for doctor
  const { aToken, logout: adminLogout } = useContext(AdminContext); // Destructure logout for admin

  const navigate = useNavigate();

  const logoutHandler = () => {
    if (aToken) {
      adminLogout(); // Call admin logout
    }
    if (dToken) {
      doctorLogout(); // Call doctor logout
    }
    navigate('/'); // Redirect to login page
  };

  return (
      <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
        <div className="flex items-center gap-2 text-xs">
          <img
              onClick={() => navigate('/')}
              className="w-36 sm:w-40 cursor-pointer"
              src={assets.admin_logo}
              alt=""
          />
          <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
            {aToken ? 'Admin' : 'Doctor'}
          </p>
        </div>
        <button
            onClick={logoutHandler} // Call unified logout handler
            className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      </div>
  );
};

export default Navbar;
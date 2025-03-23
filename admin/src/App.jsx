import React, { useContext } from 'react';
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import AddService from './pages/Admin/AddService'; // Import AddService page
//import ServicesList from './pages/Admin/ServicesList'; // Import ServicesList Page (if necessary)
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const { dToken } = useContext(DoctorContext); // Doctor's token from context
  const { aToken } = useContext(AdminContext); // Admin's token from context

  return dToken || aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          <Route path="/add-service" element={<AddService />} /> {/* Add service route */}
          <Route path="/service-list" element={<ServicesList />} /> {/* Optional Services List */}
          
          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      {/* Login Page (if unauthenticated) */}
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;
import React, { useContext } from 'react';
import { DoctorContext } from './context/DoctorContext'; // DoctorContext for checking auth token
import { AdminContext } from './context/AdminContext'; // AdminContext for checking auth token
import { Route, Routes } from 'react-router-dom'; // Routing
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'; // Nav bar
import Sidebar from './components/Sidebar'; // Side navigation
import Dashboard from './pages/Admin/Dashboard'; // Admin Dashboard
import AllAppointments from './pages/Admin/AllAppointments'; // Appointments Page
import AddDoctor from './pages/Admin/AddDoctor'; // Add doctor page
import DoctorsList from './pages/Admin/DoctorsList'; // List of doctors
import AddService from './pages/Admin/AddService'; // Add service page
import ServicesList from './pages/Admin/ServiceList.jsx'; // List of services
import Login from './pages/Login'; // Login page
import DoctorAppointments from './pages/Doctor/DoctorAppointments'; // Doctor appointments page
import DoctorDashboard from './pages/Doctor/DoctorDashboard'; // Doctor dashboard
import DoctorProfile from './pages/Doctor/DoctorProfile'; // Doctor profile page

const App = () => {
    const { dToken } = useContext(DoctorContext); // Doctor's token from context
    const { aToken } = useContext(AdminContext); // Admin's token from context

    // Routes for authenticated users (admin or doctor)
    return dToken || aToken ? (
        <div className="bg-[#F8F9FD]">
            {/* Toast container for notifications */}
            <ToastContainer />
            <Navbar />
            <div className="flex items-start">
                <Sidebar />
                <Routes>
                    {/* Admin Routes */}
                    {aToken && (
                        <>
                            <Route path="/admin-dashboard" element={<Dashboard />} />
                            <Route path="/all-appointments" element={<AllAppointments />} />
                            <Route path="/add-doctor" element={<AddDoctor />} />
                            <Route path="/doctor-list" element={<DoctorsList />} />
                            <Route path="/add-service" element={<AddService />} />
                            <Route path="/services" element={<ServicesList />} />
                        </>
                    )}

                    {/* Doctor Routes */}
                    {dToken && (
                        <>
                            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                            <Route path="/doctor-profile" element={<DoctorProfile />} />
                        </>
                    )}
                </Routes>
            </div>
        </div>
    ) : (
        // If no valid token (unauthenticated), show the Login page
        <>
            <ToastContainer />
            <Login />
        </>
    );
};

export default App;
import React, { useContext } from 'react';
import { DoctorContext } from './context/DoctorContext';
import { AdminContextProvider } from './context/AdminContext'; // Import AdminContextProvider
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import AddService from './pages/Admin/AddService';
import ServicesList from './pages/Admin/ServiceList.jsx';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
    const { dToken } = useContext(DoctorContext); // Doctor's token from context
    const { aToken } = useContext(AdminContext); // Admin's token from context

    return dToken || aToken ? (
        <AdminContextProvider> {/* Wrap everything that needs AdminContext */}
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
                        <Route path="/add-service" element={<AddService />} />
                        <Route path="/services" element={<ServicesList />} />

                        {/* Doctor Routes */}
                        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                        <Route path="/doctor-profile" element={<DoctorProfile />} />
                    </Routes>
                </div>
            </div>
        </AdminContextProvider>
    ) : (
        <>
            {/* Login Page (if unauthenticated) */}
            <ToastContainer />
            <Login />
        </>
    );
};

export default App;
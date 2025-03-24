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
        <div className="bg-[#F8F9FD]">
            <ToastContainer />
            <Navbar />
            <div className="flex items-start">
                <Sidebar />
                <Routes>
                    {/* Admin Routes wrapped in AdminContextProvider */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <AdminContextProvider>
                                <Dashboard />
                            </AdminContextProvider>
                        }
                    />
                    <Route
                        path="/all-appointments"
                        element={
                            <AdminContextProvider>
                                <AllAppointments />
                            </AdminContextProvider>
                        }
                    />
                    <Route
                        path="/add-doctor"
                        element={
                            <AdminContextProvider>
                                <AddDoctor />
                            </AdminContextProvider>
                        }
                    />
                    <Route
                        path="/doctor-list"
                        element={
                            <AdminContextProvider>
                                <DoctorsList />
                            </AdminContextProvider>
                        }
                    />
                    <Route
                        path="/add-service"
                        element={
                            <AdminContextProvider>
                                <AddService />
                            </AdminContextProvider>
                        }
                    />
                    <Route
                        path="/services"
                        element={
                            <AdminContextProvider>
                                <ServicesList />
                            </AdminContextProvider>
                        }
                    />

                    {/* Doctor Routes (outside AdminContext) */}
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
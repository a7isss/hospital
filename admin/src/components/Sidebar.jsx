import React, { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets'; // Adjust the path if necessary


const Sidebar = () => {
    const { dToken } = useContext(DoctorContext);
    const { aToken } = useContext(AdminContext);

    return (
        <div className="min-h-screen bg-white border-r">
            {/* Admin Sidebar Links */}
            {aToken && (
                <ul className="text-[#515151] mt-5">
                    <NavLink
                        to={'/admin-dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.home_icon} alt="Dashboard Icon" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>
                    <NavLink
                        to={'/all-appointments'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.appointment_icon} alt="Appointments Icon" />
                        <p className="hidden md:block">Appointments</p>
                    </NavLink>
                    <NavLink
                        to={'/add-doctor'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.add_icon} alt="Add Doctor Icon" />
                        <p className="hidden md:block">Add Doctor</p>
                    </NavLink>
                    <NavLink
                        to={'/doctor-list'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.people_icon} alt="Doctors List Icon" />
                        <p className="hidden md:block">Doctors List</p>
                    </NavLink>
                    {/* Services List */}
                    <NavLink
                        to={'/services'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.service_icon} alt="Services Icon" />
                        <p className="hidden md:block">Services List</p>
                    </NavLink>
                    {/* Add Service */}
                    <NavLink
                        to={'/add-service'} // Add navigation for Add Service
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.add_icon} alt="Add Service Icon" />
                        <p className="hidden md:block">Add Service</p>
                    </NavLink>
                </ul>
            )}

            {/* Doctor Sidebar Links */}
            {dToken && (
                <ul className="text-[#515151] mt-5">
                    <NavLink
                        to={'/doctor-dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.home_icon} alt="Dashboard Icon" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>
                    <NavLink
                        to={'/doctor-appointments'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <img className="min-w-5" src={assets.appointment_icon} alt="Appointments Icon" />
                        <p className="hidden md:block">Appointments</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
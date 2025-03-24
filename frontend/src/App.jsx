import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import Service from './pages/Service';
import Services from './pages/Services';

const App = () => {
    return (
        <div className='mx-2 sm:mx-[5%] lg:mx-[10%]'>
            {/* Toast notifications */}
            <ToastContainer
                position={document.documentElement.getAttribute('dir') === 'rtl' ? 'top-left' : 'top-right'}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={document.documentElement.getAttribute('dir') === 'rtl'}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Navbar */}
            <Navbar />

            {/* Main Routes */}
            <Routes>
                <Route path="/services" element={<Services />} />
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctors/:speciality" element={<Doctors />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointment/:docId" element={<Appointment />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/service/:id" element={<Service />} /> {/* New Route for Service Page */}
            </Routes>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Nav from './components/Nav.jsx';
import Home from './pages/Home';
import Partners from './pages/Partners';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
//import Verify from './pages/Verify';
import Service from './pages/Service';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Subscriptions from './pages/Subscriptions';
import Doctors from './components/Doctors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <div className="mx-2 sm:mx-[5%] lg:mx-[10%]">
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
                <Route path="/" element={<Home />} />
                <Route path="/Subscriptions" element={<Subscriptions />} />
                <Route path="/services" element={<Services />} />
                <Route path="/Partners" element={<Partners />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointment/:docId" element={<Appointment />} />
                <Route path="/service/:id" element={<Service />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/my-profile" element={<MyProfile />} />
            </Routes>

            {/* Bottom navigation */}
            <div className="pb-16">
                <Nav />
            </div>
        </div>
    );
};

export default App;
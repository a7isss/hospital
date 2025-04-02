import React from 'react';
import { NavLink } from 'react-router-dom';
import Sidelist from '../components/Sidelist'; // Import the Sidelist component

const Nav = () => {
    const navItems = [
        { id: 1, name: 'Cart', path: '/cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' }, // Keep Cart on the left
        { id: 2, name: 'Partners', path: '/Partners', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 3, name: 'Services', path: '/services', icon: 'M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm3 8v-2h2v2H7zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2z' },
        { id: 4, name: 'Subscriptions', path: '/subscriptions', icon: 'M9 12h6m-6 4h6m-7 4h8c1.333 0 2-.667 2-2v-8c0-1.333-.667-2-2-2H9c-1.333 0-2 .667-2 2v8c0 1.333.667 2 2 2zM15 4l.867-2.6A1 1 0 0015 0H9a1 1 0 00-.867.6L8 4' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center px-2 py-2 text-sm font-medium transition-colors ${
                                    isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                                }`
                            }
                        >
                            <svg
                                className="w-6 h-6 mb-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={item.icon}
                                />
                            </svg>
                            <span className="text-xs">{item.name}</span>
                        </NavLink>
                    ))}
                    {/* Add the Sidelist component as the last navigation item */}
                    <Sidelist />
                </div>
            </div>
        </nav>
    );
};

export default Nav;
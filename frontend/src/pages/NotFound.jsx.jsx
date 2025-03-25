import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
        <Link
            to="/"
            className="text-lg font-medium text-white bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Go Back to Home
        </Link>
      </div>
  );
};

export default NotFound;
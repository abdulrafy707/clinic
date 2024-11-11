"use client";
import React from 'react';
import { FaBell, FaEnvelope, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white shadow-lg">
      <h1 className="text-2xl font-semibold tracking-wide text-gray-100">
        Clinic Dashboard
      </h1>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <FaBell className="text-xl cursor-pointer hover:text-yellow-300 transition duration-150 ease-in-out" title="Notifications" />
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
            5
          </span>
        </div>
        <div className="relative">
          <FaEnvelope className="text-xl cursor-pointer hover:text-yellow-300 transition duration-150 ease-in-out" title="Messages" />
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>
        <FaUserCircle className="text-3xl cursor-pointer hover:text-yellow-300 transition duration-150 ease-in-out" title="Profile" />
      </div>
    </header>
  );
};

export default Header;

// src/components/Sidebar.jsx
"use client";
import React from "react";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaFileAlt,
  FaCog,
  FaHospital,
  FaClipboard,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Feedback } from "@mui/icons-material";

const Sidebar = () => {
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { label: "Doctors", icon: <FaUserMd />, path: "/admin/all-doctors" },
    { label: "Clinics", icon: <FaHospital />, path: "/admin/clinics" },
    { label: "Templates", icon: <FaClipboard />, path: "/admin/TemplatesPage" },
    { label: "Feedback", icon: <Feedback />, path: "/admin/feedback" },
    { label: "Reports", icon: <FaFileAlt />, path: "/reports" },
    { label: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-extrabold mb-8 text-center text-blue-400">
          Clinic
        </h2>
        <nav className="space-y-3">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-blue-500 hover:shadow-lg hover:text-white rounded-lg transition-all duration-200 ease-in-out"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-md font-semibold">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div className="text-center text-sm text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} Clinic Management
      </div>
    </aside>
  );
};

export default Sidebar;

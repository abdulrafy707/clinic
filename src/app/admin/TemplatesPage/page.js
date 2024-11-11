'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TemplatesPage = () => {
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [doctorTemplates, setDoctorTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch data for admin and doctor templates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [adminRes, doctorRes] = await Promise.all([
          fetch('/api/objective-tempelates').then((res) => res.json()), 
          fetch('/api/templates').then((res) => res.json()), 
        ]);

        setAdminTemplates(adminRes.templates || []);
        setDoctorTemplates(doctorRes.templates || []);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800 drop-shadow-lg animate-fadeIn">
        Template Management
      </h1>
      
      {isLoading ? (
        <p className="text-lg font-semibold text-blue-500 animate-pulse">Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          
          {/* Admin Templates Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Admin Templates</h2>
            <div className="flex items-center justify-center w-24 h-24 bg-purple-500 text-white rounded-full mb-4 shadow-md transform transition duration-300 hover:scale-110">
              <p className="text-2xl font-bold">{adminTemplates.length}</p>
            </div>
            <p className="text-lg text-gray-600 mb-6">Total Admin Templates</p>
            <button
              onClick={() => router.push('/admin/admin-tempelates')}
              className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition duration-300 ease-in-out"
            >
              Manage Admin Templates
            </button>
          </div>

          {/* Doctor Templates Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Doctor Templates</h2>
            <div className="flex items-center justify-center w-24 h-24 bg-blue-500 text-white rounded-full mb-4 shadow-md transform transition duration-300 hover:scale-110">
              <p className="text-2xl font-bold">{doctorTemplates.length}</p>
            </div>
            <p className="text-lg text-gray-600 mb-6">Total Doctor Templates</p>
            <button
              onClick={() => router.push('/admin/doctor-templates')}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Manage Doctor Templates
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default TemplatesPage;

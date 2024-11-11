'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TranscriptionChart from '../components/Transaction'; // Adjust this path as necessary

const DashboardPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]); // Represents clinics in the UI
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch data for doctors, hospitals, and templates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [doctorsRes, hospitalsRes, templatesRes] = await Promise.all([
          fetch('/api/user').then((res) => res.json()), 
          fetch('/api/hospital/add-hospital').then((res) => res.json()), 
          fetch('/api/templates').then((res) => res.json()), 
        ]);

        setDoctors(doctorsRes.users || []);
        setHospitals(hospitalsRes.hospitals || []);
        setTemplates(templatesRes.templates || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-10 text-gray-800 drop-shadow-lg animate-fadeIn">
        Welcome to Your Dashboard
      </h1>
      {isLoading ? (
        <p className="text-lg font-semibold text-blue-500 animate-pulse">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          
          {/* Doctors Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Doctors</h2>
            <div className="flex items-center justify-center w-24 h-24 bg-blue-500 text-white rounded-full mb-4 shadow-md transform transition duration-300 hover:scale-110">
              <p className="text-2xl font-bold">{doctors.length}</p>
            </div>
            <p className="text-lg text-gray-600 mb-6">Total Doctors</p>
            <button
              onClick={() => router.push('/admin/all-doctors')}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Manage Doctors
            </button>
          </div>

          {/* Clinics (Hospitals) Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Clinics</h2>
            <div className="flex items-center justify-center w-24 h-24 bg-green-500 text-white rounded-full mb-4 shadow-md transform transition duration-300 hover:scale-110">
              <p className="text-2xl font-bold">{hospitals.length}</p>
            </div>
            <p className="text-lg text-gray-600 mb-6">Total Clinics</p>
            <button
              onClick={() => router.push('/admin/clinics')}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Manage Clinics
            </button>
          </div>

          {/* Templates Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Templates</h2>
            <div className="flex items-center justify-center w-24 h-24 bg-purple-500 text-white rounded-full mb-4 shadow-md transform transition duration-300 hover:scale-110">
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
            <p className="text-lg text-gray-600 mb-6">Total Templates</p>
            <button
              onClick={() => router.push('/admin/TemplatesPage')}
              className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition duration-300 ease-in-out"
            >
              Manage Templates
            </button>
          </div>

          {/* Transcription Chart Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg col-span-1 md:col-span-3 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Transcriptions Overview</h2>
            <TranscriptionChart/> {/* Display the TranscriptionChart component */}
          </div>

        </div>
      )}
    </div>
  );
};

export default DashboardPage;

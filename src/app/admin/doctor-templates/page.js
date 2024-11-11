'use client'
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DoctorTemplatesPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorTemplateCounts, setDoctorTemplateCounts] = useState({});
  const [templates, setTemplates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors initially and their template counts
  useEffect(() => {
    const fetchDoctorsAndTemplateCounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const doctorResponse = await fetch('/api/user?role=DOCTOR');
        const countResponse = await fetch('/api/templates/count-per-doctor');

        if (!doctorResponse.ok || !countResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const doctorData = await doctorResponse.json();
        const countData = await countResponse.json();

        setDoctors(doctorData.users || []);
        
        const counts = {};
        countData.templateCounts.forEach((item) => {
          counts[item.adminId] = item._count.id;
        });
        setDoctorTemplateCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
      setIsLoading(false);
    };
    fetchDoctorsAndTemplateCounts();
  }, []);

  // Fetch templates for selected doctor
  useEffect(() => {
    const fetchTemplates = async () => {
      if (selectedDoctor) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/templates?doctorId=${selectedDoctor.id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch templates for doctor with ID: ${selectedDoctor.id}`);
          }
          const data = await response.json();
          setTemplates(data.templates || []);
          setFilteredData(data.templates || []);
        } catch (error) {
          console.error('Error fetching templates:', error);
          setError('Failed to load templates for the selected doctor.');
        }
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, [selectedDoctor]);

  // Filter templates based on search input
  useEffect(() => {
    setFilteredData(
      templates.filter((template) =>
        Object.values(template).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, templates]);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 drop-shadow-lg">
        {selectedDoctor ? `Templates for Dr. ${selectedDoctor.name}` : 'Select a Doctor'}
      </h1>

      {isLoading ? (
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : selectedDoctor ? (
        <>
          <div className="flex justify-between items-center w-full max-w-4xl mb-6">
            <div className="flex space-x-4 items-center w-full">
              <button
                className="bg-white text-gray-600 hover:text-gray-900 p-2 rounded-md shadow focus:outline-none"
                onClick={() => setFilter('')}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <input
                type="text"
                placeholder="Search templates..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedDoctor(null);
              setTemplates([]);
              setFilteredData([]);
            }}
            className="mb-4 text-blue-500 hover:text-blue-700 underline"
          >
            &larr; Back to Doctors List
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {filteredData.length > 0 ? (
              filteredData.map((template) => (
                <div
                  key={template.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {template.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Categories: {Array.isArray(template.categories)
                      ? template.categories.join(', ')
                      : JSON.parse(template.categories).join(', ')}
                  </p>
                  
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No templates found for this doctor.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Dr. {doctor.name}
                </h2>
                <p className="text-sm text-gray-500">Specialty: {doctor.specialty}</p>
                <p className="text-sm text-gray-500">
                  Templates: {doctorTemplateCounts[doctor.id] || 0}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No doctors found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorTemplatesPage;

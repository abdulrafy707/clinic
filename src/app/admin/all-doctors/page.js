'use client'
import React, { useEffect, useState } from 'react';
import FilterableDoctorTable from './FilterableDoctorTable';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Track errors

  // Function to fetch doctors from the API
  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/user?role=DOCTOR'); // Adjust the endpoint if necessary
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data.users || []); // Assuming the API returns data in the shape { users: [...] }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors. Please try again later.');
    }
    setIsLoading(false);
  };

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Doctors Management</h1>
      {isLoading ? (
        <p>Loading doctors...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error message if there's an error
      ) : (
        <FilterableDoctorTable doctors={doctors} fetchDoctors={fetchDoctors} />
      )}
    </div>
  );
};

export default DoctorsPage;

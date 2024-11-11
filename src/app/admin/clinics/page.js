'use client';
import React, { useEffect, useState } from 'react';
import FilterableClinicTable from './FilterableClinicTable';

const ClinicsPage = () => {
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch clinics (hospitals) from the API
  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hospital/add-hodpital'); // Adjust the endpoint if necessary
      if (!response.ok) {
        throw new Error('Failed to fetch clinics');
      }
      const data = await response.json();
      setClinics(data.hospitals || []); // Assuming the API returns data in the shape { hospitals: [...] }
    } catch (error) {
      console.error('Error fetching clinics:', error);
    }
    setIsLoading(false);
  };

  // Fetch clinics on component mount
  useEffect(() => {
    fetchClinics();
  }, []);

  return (
    <div className="">
     
      {isLoading ? (
        <p>Loading clinics...</p>
      ) : (
        <FilterableClinicTable clinics={clinics} fetchClinics={fetchClinics} />
      )}
    </div>
  );
};

export default ClinicsPage;

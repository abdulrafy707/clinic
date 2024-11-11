'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import FilterableDoctorTable from '../FilterableDoctorTable';

const DoctorsPage = () => {
  const { id: hospitalId } = useParams(); // Use useParams to get the hospitalId

  if (!hospitalId) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg ">
        <h1 className="text-xl font-semibold text-gray-700 mb-2 ml-4">
          Doctors for Hospital ID: <span className="text-gray-600 font-medium">{hospitalId}</span>
        </h1>
        
        <FilterableDoctorTable hospitalId={hospitalId} /> {/* Pass hospitalId as prop */}
      </div>
    </div>
  );
};

export default DoctorsPage;

'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Table from '../components/Table';
import Button from '../components/Button';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors data from API or dummy data
    const fetchDoctors = async () => {
      // Replace with your data fetching logic
      const data = [
        { Name: 'Dr. John Doe', Email: 'john@example.com', Phone: '1234567890', Status: 'Active' },
        { Name: 'Dr. Jane Smith', Email: 'jane@example.com', Phone: '0987654321', Status: 'Inactive' },
      ];
      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Doctors</h1>
      <Link href="/doctors/add">
        
          <Button className="mb-4">Add Doctor</Button>
        
      </Link>
      <Table
        headers={['Name', 'Email', 'Phone', 'Status']}
        data={doctors}
      />
    </div>
  );
}

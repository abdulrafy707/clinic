'use client'
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';

export default function AddDoctorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add doctor to the database (API call)
    // After successful addition, redirect to doctors list
    router.push('/doctors');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Add Doctor</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block">Name</label>
          <input
            className="w-full px-3 py-2 border rounded"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            className="w-full px-3 py-2 border rounded"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Phone</label>
          <input
            className="w-full px-3 py-2 border rounded"
            type="text"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Status</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Button type="submit">Add Doctor</Button>
      </form>
    </div>
  );
}

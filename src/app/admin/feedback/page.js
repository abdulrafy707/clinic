'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackAdminPanel = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ userName: '', hospitalName: '' });

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await axios.get(`/api/feedback?${query}`);
        setFeedback(response.data.feedback);
      } catch (err) {
        setError('Failed to load feedback data');
      }
      setLoading(false);
    };
    fetchFeedback();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Feedback Panel</h1>

      {/* Filters Section */}
      <div className="flex justify-center mb-8 space-x-4">
        <input
          type="text"
          name="userName"
          value={filters.userName}
          onChange={handleFilterChange}
          placeholder="Filter by User Name"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="hospitalName"
          value={filters.hospitalName}
          onChange={handleFilterChange}
          placeholder="Filter by Hospital Name"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setFilters({ userName: '', hospitalName: '' })}
          className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-red-500">{error}</td>
              </tr>
            ) : feedback.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">No feedback found.</td>
              </tr>
            ) : (
              feedback.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.userId || 'Unknown ID'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.user?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.hospital?.name || 'Unknown Hospital'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackAdminPanel;

'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    id: null,
    name: '',
    categories: '',
    adminId: '', // assuming this is required
  });
  const [error, setError] = useState(null);

  // Fetch doctorId from local storage
  const getDoctorId = () => localStorage.getItem('userId');

  // Fetch templates from API
  const fetchTemplates = async () => {
    const doctorId = getDoctorId();
    if (!doctorId) {
      setError('Doctor ID not found in local storage.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/templates?doctorId=${doctorId}`);
      const data = await response.json();

      if (response.ok) {
        setTemplates(data.templates || []);
        setFilteredData(data.templates || []);
      } else {
        setError(data.error || 'Failed to fetch templates.');
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Error fetching templates.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates based on search term
  useEffect(() => {
    setFilteredData(
      templates.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, templates]);

  const handleAddNewTemplate = async () => {
    if (!newTemplate.name || !newTemplate.categories || !newTemplate.adminId) {
      alert('All fields are required');
      return;
    }
  
    const parsedAdminId = parseInt(newTemplate.adminId, 10);
    if (isNaN(parsedAdminId)) {
      alert('Invalid admin ID');
      return;
    }
  
    setIsLoading(true);
    try {
      const cleanedCategories = newTemplate.categories
        .split(',')
        .map((category) => category.trim().replace(/^['"]+|['"]+$/g, ''));
  
      const response = newTemplate.id
        ? await fetch(`/api/templates/${newTemplate.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newTemplate.name,
              categories: cleanedCategories,
              doctorId: parsedAdminId,
            }),
          })
        : await fetch('/api/templates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newTemplate.name,
              categories: cleanedCategories,
              doctorId: parsedAdminId,
            }),
          });
  
      if (response.ok) {
        fetchTemplates();
        setIsModalOpen(false);
        setNewTemplate({
          id: null,
          name: '',
          categories: '',
          adminId: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update template:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding/updating template:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTemplate = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchTemplates(); // Refresh the data after deleting
      } else {
        console.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = (template) => {
    const categoriesArray = Array.isArray(template.categories)
      ? template.categories
      : JSON.parse(template.categories);

    setNewTemplate({
      id: template.id,
      name: template.name,
      categories: categoriesArray.join(', '), // Convert array to comma-separated string
      adminId: template.doctorId,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl pl-4 font-semibold pt-4 text-gray-800">Objective Templates</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                setNewTemplate({
                  id: null,
                  name: '',
                  categories: '',
                  adminId: getDoctorId(),
                });
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isSearchVisible && (
          <div className="mb-4 px-4">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="overflow-x-auto px-4">
          <table className="min-w-full divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectives</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(template.categories)
                      ? template.categories.join(', ')
                      : JSON.parse(template.categories).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{newTemplate.id ? 'Edit Template' : 'Add New Template'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Objectives</label>
              <input
                type="text"
                value={newTemplate.categories}
                onChange={(e) => setNewTemplate({ ...newTemplate, categories: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Enter objective separated by commas</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewTemplate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {newTemplate.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

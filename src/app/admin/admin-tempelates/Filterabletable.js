import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const FilterableObjectiveTemplateTable = ({ templates, fetchTemplates }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(templates || []);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    id: null,
    name: '',
    categories: '',
    adminId: '', // assuming this is required
  });

  useEffect(() => {
    setFilteredData(
      (templates || []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, templates]);

  const handleAddNewTemplate = async () => {
    if (!newTemplate.name || !newTemplate.categories || !newTemplate.adminId) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = newTemplate.id
        ? await fetch(`/api/objective-tempelates/${newTemplate.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newTemplate.name,
              categories: newTemplate.categories.split(','), // convert to array
              adminId: newTemplate.adminId,
            }),
          })
        : await fetch('/api/objective-tempelates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newTemplate.name,
              categories: newTemplate.categories.split(','), // convert to array
              adminId: newTemplate.adminId,
            }),
          });

      if (response.ok) {
        fetchTemplates(); // Refresh the data after adding/updating
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
    }
    setIsLoading(false);
  };

  const handleDeleteTemplate = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/objective-tempelates/${id}`, {
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
    }
    setIsLoading(false);
  };

  const handleEditTemplate = (template) => {
    setNewTemplate({
      id: template.id,
      name: template.name,
      categories: Array.isArray(template.categories) ? template.categories.join(', ') : template.categories, // Ensure it's a string
      adminId: template.adminId,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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
                  adminId: '',
                });
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isSearchVisible && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) && filteredData.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(template.categories) 
                      ? template.categories.join(', ') 
                      : JSON.parse(template.categories).join(', ')
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.adminId}</td>
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
              <label className="block text-sm font-medium text-gray-700">Categories</label>
              <input
                type="text"
                value={newTemplate.categories}
                onChange={(e) => setNewTemplate({ ...newTemplate, categories: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Enter categories separated by commas</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Admin ID</label>
              <input
                type="text"
                value={newTemplate.adminId}
                onChange={(e) => setNewTemplate({ ...newTemplate, adminId: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
};

export default FilterableObjectiveTemplateTable;

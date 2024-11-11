'use client';
import React, { useEffect, useState } from 'react';
import FilterableObjectiveTemplateTable from './Filterabletable';

const ObjectiveTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch templates from the API
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/objective-tempelates'); // Adjust the endpoint if necessary
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data.templates || []); // Assuming the API returns data in the shape { templates: [...] }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please try again later.');
    }
    setIsLoading(false);
  };

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Objective Templates Management</h1>
      {isLoading ? (
        <p>Loading templates...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <FilterableObjectiveTemplateTable templates={templates} fetchTemplates={fetchTemplates} />
      )}
    </div>
  );
};

export default ObjectiveTemplatesPage;

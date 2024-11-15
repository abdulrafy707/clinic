'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PricingAdminPanel = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'MONTHLY',
    features: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/pricingPlans');
        const formattedPlans = response.data.plans.map((plan) => ({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features : plan.features.split(',').map((f) => f.trim()),
        }));
        setPlans(formattedPlans);
      } catch (err) {
        setError('Failed to load pricing plans');
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const featuresArray = formData.features.split(',').map((f) => f.trim());

    try {
      if (isEditing) {
        await axios.patch(`/api/pricingPlans?id=${editingPlanId}`, { ...formData, features: featuresArray });
        setPlans((prev) =>
          prev.map((plan) => (plan.id === editingPlanId ? { ...plan, ...formData, features: featuresArray } : plan))
        );
      } else {
        const response = await axios.post('/api/pricingPlans', { ...formData, features: featuresArray });
        setPlans((prev) => [...prev, response.data.plan]);
      }
      resetForm();
      setShowFormModal(false);
    } catch (err) {
      setError('Failed to save pricing plan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      billingCycle: 'MONTHLY',
      features: '',
    });
    setIsEditing(false);
    setEditingPlanId(null);
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingCycle: plan.billingCycle,
      features: plan.features.join(', '),
    });
    setIsEditing(true);
    setEditingPlanId(plan.id);
    setShowFormModal(true);
  };

  const confirmDelete = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/pricingPlans?id=${planToDelete.id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== planToDelete.id));
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    } catch (err) {
      setError('Failed to delete pricing plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">Admin Pricing Plans</h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
        >
          + Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">{error}</p>
        ) : plans.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No plans found.</p>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 relative border border-gray-200 hover:border-blue-500"
            >
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {plan.billingCycle}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">{plan.name}</h2>
              <p className="text-gray-600">{plan.description}</p>
              <p className="text-gray-700 mt-4 font-bold text-lg">${plan.price} / {plan.billingCycle}</p>
              <ul className="mt-4 text-gray-600 list-disc list-inside space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(plan)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full transform transition-all duration-300">
            <h2 className="text-2xl font-semibold mt-8 mb-6 text-center">{isEditing ? 'Edit' : 'Add'} Pricing Plan</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700">Billing Cycle</label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700">Features (comma-separated)</label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="col-span-2 flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition transform hover:scale-105"
                >
                  {isEditing ? 'Update' : 'Add'} Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete the plan "{planToDelete?.name}"?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingAdminPanel;

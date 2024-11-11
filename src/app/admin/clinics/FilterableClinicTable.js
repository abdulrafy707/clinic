import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const FilterableClinicTable = () => {
  const [clinics, setClinics] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [newHospital, setNewHospital] = useState({
    id: null,
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    status: "active", // Default to 'active'
  });

  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/hospital/add-hospital");
      if (!response.ok) throw new Error("Failed to fetch clinics");
      const data = await response.json();
      setClinics(data.hospitals || []);
      setFilteredData(data.hospitals || []);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFilteredData(
      clinics.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, clinics]);

  const handleViewDoctors = (hospitalId) => {
    router.push(`/admin/clinic-doctors/${hospitalId}`);
  };

  const handleAddNewHospital = async () => {
    if (!newHospital.name || !newHospital.address || !newHospital.city || !newHospital.state || !newHospital.country || !newHospital.phone || !newHospital.email) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = newHospital.id
        ? await fetch(`http://localhost:3000/api/hospital/add-hospital/${newHospital.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHospital),
          })
        : await fetch("http://localhost:3000/api/hospital/add-hospital", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHospital),
          });

      if (response.ok) {
        fetchClinics();
        setIsModalOpen(false);
        setNewHospital({
          id: null,
          name: "",
          address: "",
          city: "",
          state: "",
          country: "",
          phone: "",
          email: "",
          status: "active",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create/update hospital:", errorData.message);
      }
    } catch (error) {
      console.error("Error adding/updating hospital:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteHospital = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/hospital/add-hospital/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) fetchClinics();
      else console.error("Failed to delete hospital");
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
    setIsLoading(false);
  };

  const handleEditHospital = (hospital) => {
    setNewHospital(hospital);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow-xl rounded-lg w-full max-w-6xl mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Clinics List</h2>
          <div className="flex space-x-4">
            <button
              className="bg-white text-gray-600 hover:text-gray-900 p-2 rounded-md shadow focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md shadow-md focus:outline-none"
              onClick={() => {
                setNewHospital({
                  id: null,
                  name: "",
                  address: "",
                  city: "",
                  state: "",
                  country: "",
                  phone: "",
                  email: "",
                  status: "active",
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
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{clinic.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{clinic.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{clinic.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{clinic.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{clinic.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{clinic.status}</td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button onClick={() => handleViewDoctors(clinic.id)} className="text-blue-500 hover:text-blue-700">
                      View
                    </button>
                    <button onClick={() => handleEditHospital(clinic)} className="text-indigo-500 hover:text-indigo-700">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteHospital(clinic.id)} className="text-red-500 hover:text-red-700">
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
          <div className="bg-white p-6 w-[600px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{newHospital.id ? "Edit Hospital" : "Add New Hospital"}</h2>
            <div className="grid grid-cols-2 gap-4">
              {["name", "email", "address", "city", "state", "country", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input
                    type="text"
                    value={newHospital[field]}
                    onChange={(e) => setNewHospital({ ...newHospital, [field]: e.target.value })}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newHospital.status}
                  onChange={(e) => setNewHospital({ ...newHospital, status: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md">
                Cancel
              </button>
              <button onClick={handleAddNewHospital} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
                {newHospital.id ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableClinicTable;

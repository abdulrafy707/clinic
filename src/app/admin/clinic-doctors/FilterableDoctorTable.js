import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const FilterableDoctorTable = ({ hospitalId }) => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDoctors = async () => {
    if (!hospitalId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hospital/fetch-doctors/${hospitalId}`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data.doctors || []);
      setFilteredData(data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (hospitalId) fetchDoctors();
  }, [hospitalId]);

  useEffect(() => {
    setFilteredData(
      doctors.filter((doctor) =>
        Object.values(doctor).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, doctors]);

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hospital/fetch-doctors/${doctorId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) fetchDoctors();
      else console.error("Failed to delete doctor");
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
    setIsLoading(false);
  };

  const handleUpdateDoctor = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hospital/fetch-doctors/${selectedDoctor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDoctor),
      });
      if (response.ok) {
        fetchDoctors();
        setIsModalOpen(false);
        setSelectedDoctor(null);
      } else {
        console.error("Failed to update doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Doctors List</h2>
          <button
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </div>
        {isSearchVisible && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search doctors..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                {["ID", "Name", "Email", "Phone", "City", "Country", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{doctor.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{doctor.status}</td>
                  <td className="px-6 py-4 flex space-x-4">
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
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
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Doctor</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedDoctor?.name || ""}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, name: e.target.value })}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedDoctor?.email || ""}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, email: e.target.value })}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={selectedDoctor?.phone || ""}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, phone: e.target.value })}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedDoctor?.status || "inactive"}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, status: e.target.value })}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDoctor}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableDoctorTable;

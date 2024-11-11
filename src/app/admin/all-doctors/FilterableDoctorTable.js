import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const FilterableDoctorTable = ({ doctors, fetchDoctors }) => {
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState(doctors || []);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    address: "",
    role: "DOCTOR",
    password: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      (doctors || []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, doctors]);

  const handleAddNewDoctor = async () => {
    if (
      !newDoctor.name ||
      !newDoctor.email ||
      !newDoctor.phone ||
      !newDoctor.city ||
      !newDoctor.state ||
      !newDoctor.country ||
      !newDoctor.password
    ) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = newDoctor.id
        ? await fetch(`/api/user/${newDoctor.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDoctor),
          })
        : await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDoctor),
          });

      if (response.ok) {
        fetchDoctors();
        setIsModalOpen(false);
        setNewDoctor({
          id: null,
          name: "",
          email: "",
          phone: "",
          city: "",
          state: "",
          country: "",
          address: "",
          role: "DOCTOR",
          password: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create/update doctor:", errorData.message);
      }
    } catch (error) {
      console.error("Error adding/updating doctor:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteDoctor = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchDoctors();
      } else {
        console.error("Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
    setIsLoading(false);
  };

  const handleEditDoctor = (doctor) => {
    setNewDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-xl w-full max-w-6xl mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Doctors List</h2>
          <div className="flex space-x-4">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-md shadow focus:outline-none"
              onClick={() => {
                setNewDoctor({
                  id: null,
                  name: "",
                  email: "",
                  phone: "",
                  city: "",
                  state: "",
                  country: "",
                  address: "",
                  role: "DOCTOR",
                  password: "",
                });
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
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
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(filteredData) &&
                filteredData.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {doctor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doctor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doctor.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doctor.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doctor.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-red-500 hover:text-red-700"
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
          <div className="bg-white p-6 w-[500px] rounded-lg shadow-lg">
            <h2 className="text-xl mb-4 font-semibold">
              {newDoctor.id ? "Edit Doctor" : "Add New Doctor"}
            </h2>
            <div className="space-y-4">
              {["name", "email", "phone", "city", "state", "country", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={newDoctor[field]}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, [field]: e.target.value })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={newDoctor.password}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, password: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewDoctor}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                {newDoctor.id ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableDoctorTable;

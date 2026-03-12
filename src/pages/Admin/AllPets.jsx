import React, { useState, useEffect } from "react";
import axiosSecure from "../../api/axiosSecure";
import {
  FiTrash2,
  FiEdit2,
  FiMapPin,
  FiDollarSign,
  FiTag,
} from "react-icons/fi";
import Swal from "sweetalert2";

const AllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Fetch all pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/pets");
        const petsData = response.data.data || [];
        setPets(petsData);
        setFilteredPets(petsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pets:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch pets",
        });
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    let result = pets;
    if (searchTerm) {
      result = result.filter(
        (pet) =>
          pet.pet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (categoryFilter) {
      result = result.filter((pet) => pet.category === categoryFilter);
    }

    setFilteredPets(result);
  }, [searchTerm, categoryFilter, pets]);

  // Mark as Adopted
  const handleHidePet = async (petId, petName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Mark ${petName} as adopted?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as adopted!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/pets/${petId}`, { available: false });

          setPets((prev) =>
            prev.map((pet) =>
              pet._id === petId ? { ...pet, available: false } : pet,
            ),
          );

          Swal.fire(
            "Updated!",
            `${petName} has been marked as adopted.`,
            "success",
          );
        } catch (error) {
          console.error("Error updating pet:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update pet",
          });
        }
      }
    });
  };

  const categories = [...new Set(pets.map((pet) => pet.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            All Pets
          </h1>
          <p className="text-gray-600">
            Manage all pets in your adoption platform
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Pets
              </label>
              <input
                type="text"
                placeholder="Search by name, breed, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredPets.length} of {pets.length} pets
          </p>
        </div>

        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative overflow-hidden bg-gray-200 h-48">
                  <img
                    src={pet.image}
                    alt={pet.pet_name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image")
                    }
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pet.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pet.available ? "Available" : "Adopted"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {pet.pet_name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <FiTag size={16} />
                    <span>{pet.category}</span>
                    <span className="mx-1">•</span>
                    <span>{pet.breed}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <FiMapPin size={16} />
                    <span>{pet.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Age</p>
                      <p className="font-semibold text-gray-800">{pet.age}</p>
                    </div>
                    <div className="bg-pink-50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Gender</p>
                      <p className="font-semibold text-gray-800">
                        {pet.gender}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Health Status</p>
                    <p
                      className={`text-sm font-semibold ${
                        pet.health_status === "Healthy"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {pet.health_status}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-lg font-bold text-blue-600">
                    <FiDollarSign size={18} />
                    <span>{pet.adoption_fee}</span>
                  </div>

                  {pet.vaccinated && (
                    <div className="mb-4 bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold text-center">
                      ✓ Vaccinated
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleHidePet(pet._id, pet.pet_name)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                    >
                      Hide / Adopted
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">
              No pets found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPets;

import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import axiosSecure from "../api/axiosSecure";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();
  const { user, loading, setLoading } = useContext(AuthContext);

  useEffect(() => {
    axiosSecure
      .get(`/pets/${id}`)
      .then((res) => {
        setPet(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pet:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pet Not Found
          </h2>
          <button
            onClick={() => navigate("/pets")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Pets
          </button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      Dog: "bg-blue-100 text-blue-800",
      Cat: "bg-purple-100 text-purple-800",
      Rabbit: "bg-pink-100 text-pink-800",
      Bird: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getHealthStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    if (status === "Healthy") return "bg-green-100 text-green-800";
    if (status.toLowerCase().includes("treatment"))
      return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleDeletePet = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`http://localhost:5000/pets/${id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          })
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Pet has been deleted.",
              icon: "success",
            });
            navigate("/pets");
          })
          .catch((err) => {
            console.error("Error deleting pet:", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete pet.",
            });
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-26 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/pets")}
          className="mb-8 flex items-center text-orange-600 hover:text-orange-700 transition-colors font-semibold"
        >
          ← Back to Pets
        </button>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden">
              <img
                src={pet.image}
                alt={pet.pet_name}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/500x400?text=Pet+Image")
                }
              />
              <div
                className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${getCategoryColor(
                  pet.category,
                )} shadow-lg`}
              >
                {pet.category}
              </div>
              {pet.vaccinated && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ✓ Vaccinated
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold uppercase">
                  Available
                </p>
                <p className="text-lg font-bold text-blue-800">
                  {pet.available ? "Yes ✓" : "No"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                <p className="text-xs text-pink-600 font-semibold uppercase">
                  Vaccinated
                </p>
                <p className="text-lg font-bold text-pink-800">
                  {pet.vaccinated ? "Yes ✓" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Name and Breed */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {pet.pet_name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{pet.breed}</p>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "{pet.description}"
              </p>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold uppercase">
                  Gender
                </p>
                <p className="text-lg font-bold text-blue-800">{pet.gender}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <p className="text-xs text-pink-600 font-semibold uppercase">
                  Age
                </p>
                <p className="text-lg font-bold text-pink-800">{pet.age}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 font-semibold uppercase">
                  Size
                </p>
                <p className="text-lg font-bold text-purple-800">{pet.size}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 font-semibold uppercase">
                  Color
                </p>
                <p className="text-lg font-bold text-green-800">{pet.color}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-semibold">
                  📍 Location:
                </span>
                <span className="text-gray-800 font-bold">{pet.location}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-semibold">
                  💊 Health Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${getHealthStatusColor(
                    pet.health_status,
                  )}`}
                >
                  {pet.health_status}
                </span>
              </div>
            </div>

            {/* Adoption Fee and Button */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-6 rounded-lg mb-4 border border-orange-200">
                <p className="text-gray-600 font-semibold mb-2">Adoption Fee</p>
                <p className="text-3xl font-bold text-orange-600">
                  ${pet.adoption_fee}
                </p>
              </div>

              {pet.available && (
                <button
                  onClick={() => navigate(`/adoption/${pet._id}`)}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  🐾 Adopt Now
                </button>
              )}
              {!pet.available && (
                <div className="w-full bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-center text-lg">
                  Not Available for Adoption
                </div>
              )}

              {user && (
                <button className="w-full mt-3 border-2 border-red-500 text-red-500 font-bold py-3 px-6 rounded-lg hover:bg-red-50 transition-all duration-300">
                  ❤️ Add to Favorites
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Complete Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <h3 className="text-sm font-bold text-blue-600 uppercase mb-3">
                Breed Details
              </h3>
              <p className="text-gray-800">
                <span className="font-semibold">Category:</span> {pet.category}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Breed:</span> {pet.breed}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Color:</span> {pet.color}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <h3 className="text-sm font-bold text-green-600 uppercase mb-3">
                Health Information
              </h3>
              <p className="text-gray-800">
                <span className="font-semibold">Status:</span>{" "}
                {pet.health_status}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Vaccinated:</span>{" "}
                {pet.vaccinated ? "Yes" : "No"}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Available:</span>{" "}
                {pet.available ? "Yes" : "No"}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <h3 className="text-sm font-bold text-purple-600 uppercase mb-3">
                Personal Details
              </h3>
              <p className="text-gray-800">
                <span className="font-semibold">Age:</span> {pet.age}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Gender:</span> {pet.gender}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Size:</span> {pet.size}
              </p>
            </div>
          </div>
        </div>
        {user?.role === "admin" && (
          <div className="my-4">
            <button
              onClick={() => handleDeletePet(pet._id)}
              className="cursor-pointer text-xl font-semibold text-white border-2 border-red-500 rounded-xl w-full bg-red-500 py-3 hover:bg-red-600 transition-colors duration-300"
            >
              Delete Pet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetails;

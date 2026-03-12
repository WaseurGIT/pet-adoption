import React, { useState, useEffect } from "react";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const UserAdoptionHistory = () => {
  const { user } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [petDetails, setPetDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");

  // Fetch user's adoptions
  useEffect(() => {
    const fetchAdoptions = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosSecure.get(`/adoptions/${user.email}`);
        const adoptionsData = response.data.data || [];
        setAdoptions(adoptionsData);

        // Fetch pet details for each adoption using MongoDB ObjectId
        const petDetailsMap = {};
        await Promise.all(
          adoptionsData.map(async (adoption) => {
            try {
              const petResponse = await axiosSecure.get(`/pets/${adoption.petId}`);
              if (petResponse.data.success) {
                petDetailsMap[adoption.petId] = petResponse.data.data;
              }
            } catch (error) {
              console.error(`Error fetching pet ${adoption.petId}:`, error);
            }
          })
        );
        
        setPetDetails(petDetailsMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching adoptions:', error);
        setLoading(false);
      }
    };
    fetchAdoptions();
  }, [user?.email]);

  // Sort adoptions
  const sortedAdoptions = [...adoptions].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
    } else if (sortBy === "pet") {
      const petNameA = petDetails[a.petId]?.pet_name || "";
      const petNameB = petDetails[b.petId]?.pet_name || "";
      return petNameA.localeCompare(petNameB);
    }
    return 0;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">
              Please log in to view your adoption applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            My Adoption Applications
          </h1>
          <p className="text-gray-600 text-sm">
            Track your pet adoption requests
          </p>
        </div>

        {/* Summary Cards */}
        {adoptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-gray-600 text-xs font-semibold mb-1">
                Total Adopted Pets
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {adoptions.length}
              </h3>
            </div>
          </div>
        )}

        {/* Sort Dropdown */}
        {adoptions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="latest">Latest First</option>
                <option value="pet">Pet Name</option>
              </select>
            </div>
          </div>
        )}

        {/* Adoptions List */}
        {sortedAdoptions.length > 0 ? (
          <div className="space-y-3">
            {sortedAdoptions.map((adoption) => (
              <div
                key={adoption._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="bg-linear-to-r from-blue-500 to-blue-600 px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white  mb-0.5">
                        {petDetails[adoption.petId]?.pet_name || 'Pet'}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded">
                          {petDetails[adoption.petId]?.category || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-blue-100 text-xs">{formatDate(adoption.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Personal Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs flex items-center gap-2">
                      <FiUser size={14} />
                      Personal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          NAME
                        </p>
                        <p className="text-xs text-gray-800">
                          {adoption.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          OCCUPATION
                        </p>
                        <p className="text-xs text-gray-800">
                          {adoption.occupation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs flex items-center gap-2">
                      <FiMail size={14} />
                      Contact
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <FiMail
                          size={12}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="break-all text-blue-600">
                          {adoption.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <FiPhone
                          size={12}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>{adoption.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs flex items-center gap-2">
                      <FiMapPin size={14} />
                      Address
                    </h4>
                    <p className="text-xs text-gray-700 mb-0.5">
                      {adoption.address}
                    </p>
                    <p className="text-xs text-gray-600">
                      {adoption.city}, {adoption.state} {adoption.zipCode}
                    </p>
                  </div>

                  {/* Home Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs flex items-center gap-2">
                      <FiHome size={14} />
                      Home
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          Type
                        </p>
                        <p className="text-xs font-semibold text-gray-800 capitalize">
                          {adoption.homeType}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          Own/Rent
                        </p>
                        <p className="text-xs font-semibold text-gray-800 capitalize">
                          {adoption.ownRent}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          Years
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                          {adoption.yearsAtHome}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          Landlord
                        </p>
                        <p className="text-xs font-semibold text-gray-800 capitalize">
                          {adoption.landlordAllowsPets}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs flex items-center gap-2">
                      <FiUsers size={14} />
                      Household
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          Adults
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                          {adoption.adultsInHome}
                        </p>
                      </div>
                      <div className="bg-pink-50 p-2 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">
                          Children
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                          {adoption.childrenAges || "None"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Other Pets:</span>{" "}
                      {adoption.otherPets}
                    </p>
                    {adoption.otherPetsDetails && (
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold">Details:</span>{" "}
                        {adoption.otherPetsDetails}
                      </p>
                    )}
                  </div>

                  {/* Pet Care Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs">
                      Care Plan
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Work:</span>{" "}
                        {adoption.workSchedule}h
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Exercise:</span>{" "}
                        {adoption.exerciseTime}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Reason:</span>{" "}
                        {adoption.adoptionReason}
                      </p>
                    </div>
                  </div>

                  {/* Veterinary Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs">
                      Vet Reference
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Name:</span>{" "}
                        {adoption.vetName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <FiPhone size={12} className="text-gray-400" />
                        <span>{adoption.vetPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <FiMail size={12} className="text-gray-400" />
                        <span className="break-all text-blue-600">
                          {adoption.vetEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Submitted:</span>{" "}
                      {formatDate(adoption.createdAt)}
                    </p>
                    {adoption.agreeTerms && (
                      <div className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                        <FiCheckCircle size={14} />
                        <span>Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <FiHome size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              You haven't submitted any adoption applications yet.
            </p>
            <a
              href="/adoption"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Pets for Adoption
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAdoptionHistory;

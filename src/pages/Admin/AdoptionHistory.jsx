import React, { useState, useEffect } from 'react';
import axiosSecure from '../../api/axiosSecure';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiSearch,
} from 'react-icons/fi';

const AdoptionHistory = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [filteredAdoptions, setFilteredAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Fetch adoptions
  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get('/adoptions');
        const adoptionsData = response.data.data || [];
        setAdoptions(adoptionsData);
        setFilteredAdoptions(adoptionsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching adoptions:', error);
        setLoading(false);
      }
    };
    fetchAdoptions();
  }, []);

  // Search and filter adoptions
  useEffect(() => {
    let result = adoptions;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (adoption) =>
          adoption.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adoption.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adoption.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adoption.petId.toString().includes(searchTerm)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
      } else if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      return 0;
    });

    setFilteredAdoptions(result);
  }, [searchTerm, sortBy, adoptions]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading adoption history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Adoption History
          </h1>
          <p className="text-gray-600">Track all adoption applications and requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Adoptions</p>
            <h3 className="text-3xl font-bold text-gray-800">{adoptions.length}</h3>
            <p className="text-green-600 text-sm mt-2">Applications processed</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Adoptions
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, city, or pet ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="latest">Latest</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredAdoptions.length} of {adoptions.length} adoptions
          </p>
        </div>

        {/* Adoptions Grid */}
        {filteredAdoptions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAdoptions.map((adoption) => (
              <div
                key={adoption._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser size={18} className="text-white" />
                        <h3 className="text-lg font-bold text-white">
                          {adoption.fullName}
                        </h3>
                      </div>
                    </div>
                    {/* {adoption.agreeTerms && (
                      <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <FiCheckCircle size={16} />
                        <span className="text-xs font-semibold">Approved</span>
                      </div>
                    )} */}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Contact Information */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Contact Info</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiMail size={16} className="text-gray-400 shrink-0" />
                        <span className="break-all text-blue-600">{adoption.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiPhone size={16} className="text-gray-400 shrink-0" />
                        <span>{adoption.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <FiMapPin size={16} />
                      Address
                    </h4>
                    <p className="text-gray-700 text-sm mb-1">{adoption.address}</p>
                    <p className="text-gray-600 text-sm">
                      {adoption.city}, {adoption.state} {adoption.zipCode}
                    </p>
                  </div>

                  {/* Home & Household Information */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <FiHome size={16} />
                      Home Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Home Type</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {adoption.homeType}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Own/Rent</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {adoption.ownRent}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Years at Home</p>
                        <p className="text-sm font-semibold text-gray-800">{adoption.yearsAtHome}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Landlord Allows</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {adoption.landlordAllowsPets}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <FiUsers size={16} />
                      Family
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Adults</p>
                        <p className="text-sm font-semibold text-gray-800">{adoption.adultsInHome}</p>
                      </div>
                      <div className="bg-pink-50 p-3 rounded">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Children</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {adoption.childrenAges || 'None'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      <span className="font-semibold">Other Pets:</span>{' '}
                      <span className="capitalize">{adoption.otherPets}</span>
                    </p>
                    {adoption.otherPetsDetails && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">Details:</span> {adoption.otherPetsDetails}
                      </p>
                    )}
                  </div>

                  {/* Work & Pet Care */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Pet Care Schedule</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Work Schedule:</span> {adoption.workSchedule}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Exercise Time:</span> {adoption.exerciseTime}
                      </p>
                    </div>
                  </div>

                  {/* Veterinary Information */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Veterinary Reference</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Vet Name:</span> {adoption.vetName}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiPhone size={14} className="text-gray-400" />
                        <span>{adoption.vetPhone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiMail size={14} className="text-gray-400" />
                        <span className="break-all text-blue-600">{adoption.vetEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Occupation & Reason */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-semibold mb-1">OCCUPATION</p>
                      <p className="text-sm text-gray-800">{adoption.occupation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">ADOPTION REASON</p>
                      <p className="text-sm text-gray-800 italic">"{adoption.adoptionReason}"</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span>{formatDate(adoption.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <FiUser size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No adoption applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionHistory;
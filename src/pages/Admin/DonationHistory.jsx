import React, { useState, useEffect } from 'react';
import axiosSecure from '../../api/axiosSecure';
import { FiDollarSign, FiMail, FiPhone, FiUser, FiCalendar } from 'react-icons/fi';
import { SiPaypal, SiStripe } from 'react-icons/si';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get('/donations');
        const donationsData = response.data.data || [];
        setDonations(donationsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Sort and filter donations
  const processedDonations = donations
    .filter((donation) => {
      if (filterPaymentMethod) {
        return donation.paymentMethod === filterPaymentMethod;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
      } else if (sortBy === 'highest') {
        return b.amount - a.amount;
      } else if (sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });

  // Get unique payment methods
  const paymentMethods = [...new Set(donations.map((d) => d.paymentMethod))];

  // Calculate total donations
  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'paypal':
        return <SiPaypal size={18} className="text-blue-600" />;
      case 'stripe':
        return <SiStripe size={18} className="text-purple-600" />;
      default:
        return <FiDollarSign size={18} className="text-gray-600" />;
    }
  };

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
          <p className="mt-4 text-gray-600">Loading donation history...</p>
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
            Donation History
          </h1>
          <p className="text-gray-600">Track all donations received</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Donations</p>
            <h3 className="text-3xl font-bold text-gray-800">${totalDonations.toLocaleString()}</h3>
            <p className="text-green-600 text-sm mt-2">{donations.length} donations</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Payment Method
              </label>
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {processedDonations.length} of {donations.length} donations
          </p>
        </div>

        {/* Donations Grid */}
        {processedDonations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedDonations.map((donation) => (
              <div
                key={donation._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPaymentIcon(donation.paymentMethod)}
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {donation.paymentMethod}
                        </p>
                      </div>
                    </div>
                    {donation.anonymous && (
                      <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-xs font-semibold">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Amount */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-gray-500 text-xs font-semibold mb-1">DONATION AMOUNT</p>
                    <h3 className="text-3xl font-bold text-green-600">
                      ${donation.amount}
                    </h3>
                  </div>

                  {/* Donor Info */}
                  {!donation.anonymous && (
                    <>
                      <div className="mb-4">
                        <div className="flex items-start gap-2 text-sm text-gray-700 mb-3">
                          <FiUser size={16} className="mt-0.5 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-gray-500 text-xs font-semibold mb-1">
                              DONOR NAME
                            </p>
                            <p className="font-semibold">{donation.fullName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-700 mb-3">
                          <FiMail size={16} className="mt-0.5 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-gray-500 text-xs font-semibold mb-1">
                              EMAIL
                            </p>
                            <p className="break-all text-blue-600 hover:underline">
                              {donation.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <FiPhone size={16} className="mt-0.5 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-gray-500 text-xs font-semibold mb-1">
                              PHONE
                            </p>
                            <p className="font-semibold">{donation.phone}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Message */}
                  {donation.message && (
                    <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                      <p className="text-gray-500 text-xs font-semibold mb-2">MESSAGE</p>
                      <p className="text-gray-700 text-sm italic">"{donation.message}"</p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span>{formatDate(donation.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <FiDollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No donations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
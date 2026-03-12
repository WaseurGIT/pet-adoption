import React, { useState, useEffect } from 'react';
import axiosSecure from '../../api/axiosSecure';
import useAuth from '../../hooks/useAuth';
import { FiDollarSign, FiMail, FiPhone, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { SiPaypal, SiStripe } from 'react-icons/si';

const UserDonationHistory = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');

  // Fetch user's donations
  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosSecure.get(`/donations/${user.email}`);
        
        // Handle both old format (array) and new format (with stats)
        const donationData = response.data;
        const donationsArray = Array.isArray(donationData) ? donationData : (donationData.data || []);
        setDonations(donationsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setLoading(false);
      }
    };
    fetchDonations();
  }, [user?.email]);

  // Sort donations
  const sortedDonations = [...donations].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
    } else if (sortBy === 'highest') {
      return b.amount - a.amount;
    } else if (sortBy === 'lowest') {
      return a.amount - b.amount;
    }
    return 0;
  });

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

  // Calculate statistics
  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const averageDonation = donations.length > 0 ? (totalDonations / donations.length).toFixed(2) : 0;
  const largestDonation = donations.length > 0 ? Math.max(...donations.map((d) => d.amount || 0)) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your donations...</p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">Please log in to view your donation history.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            My Donations
          </h1>
          <p className="text-gray-600">View your contribution history and impact</p>
        </div>

        {/* Summary Cards */}
        {donations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold mb-2">Total Donated</p>
              <h3 className="text-3xl font-bold text-gray-800">${totalDonations.toFixed(2)}</h3>
              <p className="text-green-600 text-sm mt-2">{donations.length} contributions</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold mb-2">Average Donation</p>
              <h3 className="text-3xl font-bold text-gray-800">${averageDonation}</h3>
              <p className="text-blue-600 text-sm mt-2">Per donation</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-semibold mb-2">Largest Donation</p>
              <h3 className="text-3xl font-bold text-gray-800">${largestDonation.toFixed(2)}</h3>
              <p className="text-purple-600 text-sm mt-2">Highest amount</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm font-semibold mb-2">Impact</p>
              <div className="flex items-center gap-2">
                <FiTrendingUp size={24} className="text-orange-500" />
                <h3 className="text-3xl font-bold text-gray-800">{donations.length}</h3>
              </div>
              <p className="text-orange-600 text-sm mt-2">Times contributed</p>
            </div>
          </div>
        )}

        {/* Sort Dropdown */}
        {donations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="latest">Latest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        )}

        {/* Donations List */}
        {sortedDonations.length > 0 ? (
          <div className="space-y-6">
            {sortedDonations.map((donation) => (
              <div
                key={donation._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                  {/* Left Side - Donation Info */}
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                      {getPaymentIcon(donation.paymentMethod)}
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          {donation.paymentMethod}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
                      </div>
                    </div>

                    {/* Donor Details */}
                    <div className="space-y-2">
                      {!donation.anonymous && (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiMail size={14} className="text-gray-400" />
                            <span className="break-all">{donation.email}</span>
                          </div>
                          {donation.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <FiPhone size={14} className="text-gray-400" />
                              <span>{donation.phone}</span>
                            </div>
                          )}
                        </>
                      )}
                      {donation.anonymous && (
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Anonymous Donation
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    {donation.message && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-lg border-l-2 border-blue-300">
                        <p className="text-sm text-gray-700 italic">
                          "{donation.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Amount */}
                  <div className="flex items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-semibold mb-1">AMOUNT</p>
                      <p className="text-4xl font-bold text-green-600">
                        ${(donation.amount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="hidden sm:block h-12 border-l border-gray-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <FiDollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-4">You haven't made any donations yet.</p>
            <a
              href="/donation"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Make Your First Donation
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDonationHistory;
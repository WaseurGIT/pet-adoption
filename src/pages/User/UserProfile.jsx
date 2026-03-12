
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";
import { FiDollarSign, FiClipboard, FiCheckCircle, FiClock } from "react-icons/fi";

const UserProfile = () => {
  const { user, role, loading } = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    adoptions: 0,
    applicationsApproved: 0,
  });

  useEffect(() => {
    if (user?.email) {
      // Fetch user info
      axiosSecure
        .get(`/users/email/${user.email}`)
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          setUserInfo({ name: user.displayName, email: user.email });
        });

      // Fetch donations and adoptions stats
      Promise.all([
        axiosSecure.get(`/donations/${user.email}`).catch(() => ({ data: [] })),
        axiosSecure.get(`/adoptions/${user.email}`).catch(() => ({ data: { data: [] } })),
      ])
        .then(([donationsRes, adoptionsRes]) => {
          // Handle donations - returns array directly
          const donations = Array.isArray(donationsRes.data) 
            ? donationsRes.data 
            : donationsRes.data.data || [];

          // Handle adoptions - returns object with data property
          const adoptions = adoptionsRes.data.data || [];

          const totalAmount = donations.reduce(
            (sum, donation) => sum + (donation.amount || 0),
            0
          );
          
          const approved = adoptions.filter(
            (adoption) => adoption.status === "approved"
          ).length;

          setStats({
            totalDonations: donations.length,
            totalAmount: totalAmount,
            adoptions: adoptions.length,
            applicationsApproved: approved,
          });
        })
        .catch((err) => {
          console.error("Error fetching stats:", err);
          // Set default stats if fetch fails
          setStats({
            totalDonations: 0,
            totalAmount: 0,
            adoptions: 0,
            applicationsApproved: 0,
          });
        });
    }
  }, [user?.email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-32 bg-linear-to-r from-blue-500 to-blue-600"></div>

          <div className="px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center overflow-hidden shadow-lg">
                {userInfo?.photoURL ? (
                  <img
                    src={userInfo.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-red-600">
                    {userInfo?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="sm:mt-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-blue-500">
                  {userInfo?.name || "User Name"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {role && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize font-medium">
                      {role}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-lg text-gray-900 mt-1 break-all">
                  {userInfo?.email}
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {userInfo?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Email Verified:</span>{" "}
              {user?.emailVerified ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-red-600 font-medium">No</span>
              )}
            </p>
            <p>
              <span className="font-semibold">Account Created:</span>{" "}
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Last Sign In:</span>{" "}
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Total Donations
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalDonations}
                  </p>
                </div>
                <FiDollarSign className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Amount Donated
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${stats.totalAmount.toFixed(2)}
                  </p>
                </div>
                <FiDollarSign className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Adoption Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.adoptions}
                  </p>
                </div>
                <FiClipboard className="w-10 h-10 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

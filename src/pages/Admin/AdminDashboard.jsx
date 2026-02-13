import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiDollarSign,
  FiHeart,
  FiTrendingUp,
  FiArrowRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { GiDogBowl } from "react-icons/gi";
import axiosSecure from "../../api/axiosSecure";

const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/pets")
      .then((res) => setPets(res.data.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  useEffect(() => {
    axiosSecure
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  useEffect(() => {
    axiosSecure
      .get("/donations")
      .then((res) => {
        setDonations(res.data);
      })
      .catch((error) => console.error("Error fetching donations:", error));
  }, []);
  useEffect(() => {
    axiosSecure
      .get("/adoptions")
      .then((res) => setAdoptions(res.data.data))
      .catch((error) => console.error("Error fetching adoptions:", error));
  }, []);

  const [recentPets, setRecentPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const [petsRes, usersRes, donationsRes] = await Promise.all([
        axiosSecure.get("/pets"),
        axiosSecure.get("/users"),
        axiosSecure.get("/donations"),
      ]);

      // Get recent pets
      setRecentPets(petsRes.data.slice(0, 5) || []);
      setUsers(usersRes.data);
      setDonations(donationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div
      className="bg-white rounded-xl shadow-lg p-6 border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <FiTrendingUp size={16} /> {trend}
            </p>
          )}
        </div>
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={32} style={{ color }} />
        </div>
      </div>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, color, to, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${color}`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your pet adoption platform</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={GiDogBowl}
            title="Total Pets"
            value={pets?.length || 0}
            color="#3B82F6"
          />
          <StatCard
            icon={FiUsers}
            title="Total Users"
            value={users?.length || 0}
            color="#8B5CF6"
          />
          <StatCard
            icon={FiDollarSign}
            title="Total Donations"
            value={`$${(Array.isArray(donations) ? donations : [])
              .reduce((sum, donation) => sum + (donation.amount || 0), 0)
              .toLocaleString()}`}
            color="#10B981"
          />
          <StatCard
            icon={FiHeart}
            title="Total Adoptions"
            value={adoptions?.length || 0}
            color="#F59E0B"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              icon={FiPlus}
              label="Add New Pet"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              to="/addPet"
            />
          </div>
        </div>

        {/* Recent Pets */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Pets Added
            </h2>
            <Link
              to="/admin/manage-pets"
              className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700"
            >
              View All <FiArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : recentPets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Pet Name
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Gender
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Age
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPets.map((pet) => (
                    <tr
                      key={pet._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pet.image}
                            alt={pet.pet_name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/40x40?text=Pet")
                            }
                          />
                          <span className="font-semibold text-gray-800">
                            {pet.pet_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {pet.pet_type}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                          {pet.gender}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{pet.age}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <FiEdit2 size={18} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pets found.{" "}
              <Link to="/addPet" className="text-blue-600 font-semibold">
                Add one now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

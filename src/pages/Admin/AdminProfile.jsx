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
import { GiDogBowl, GiPaw } from "react-icons/gi";
import axiosSecure from "../../api/axiosSecure";
import DonationStats from "../../components/AdminStats/DonationStats";
import AdoptionStats from "../../components/AdminStats/AdoptionStats";
import PetStats from "../../components/AdminStats/PetStats";

const AdminProfile = () => {
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [petFoods, setPetFoods] = useState([]);

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
        setDonations(res.data.data || []);
      })
      .catch((error) => console.error("Error fetching donations:", error));
  }, []);

  useEffect(() => {
    axiosSecure
      .get("/adoptions")
      .then((res) => setAdoptions(res.data.data))
      .catch((error) => console.error("Error fetching adoptions:", error));
  }, []);

  useEffect(() => {
    axiosSecure
      .get("/petfoods")
      .then((res) => setPetFoods(res.data.data || []))
      .catch((error) => console.error("Error fetching pet foods:", error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, usersRes, donationsRes] = await Promise.all([
          axiosSecure.get("/pets"),
          axiosSecure.get("/users"),
          axiosSecure.get("/donations"),
        ]);

        setUsers(usersRes.data);
        setDonations(donationsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your pet adoption platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={GiPaw}
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
            value={`$${(Array.isArray(donations) && donations.length > 0
              ? donations.reduce(
                  (sum, donation) => sum + (donation.amount || 0),
                  0,
                )
              : 0
            ).toLocaleString()}`}
            color="#10B981"
          />
          <StatCard
            icon={FiHeart}
            title="Total Adoptions"
            value={adoptions?.length || 0}
            color="#F59E0B"
          />
          <StatCard
            icon={GiDogBowl}
            title="Total Pet Foods"
            value={petFoods?.length || 0}
            color="#F59E0B"
          />
        </div>
        {/* stats */}
        <div>
          {/* <PetStats /> */}
          <PetStats />
          {/* <AdoptionStats /> */}
          <AdoptionStats />
          {/* <DonationStats /> */}
          <DonationStats />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

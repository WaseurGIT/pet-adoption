import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosSecure from "../../api/axiosSecure";

const DonationStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/donations");

        if (response.data.success && response.data.data) {
          // Group donations by date
          const groupedData = groupDonationsByDate(response.data.data);
          setData(groupedData);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donation statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const groupDonationsByDate = (donations) => {
    const grouped = {};

    donations.forEach((donation) => {
      // Parse the date from donation data
      const date = new Date(donation.date || donation.createdAt);
      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          amount: 0,
          count: 0,
        };
      }

      grouped[dateKey].amount += donation.amount || 0;
      grouped[dateKey].count += 1;
    });

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <p className="text-lg text-gray-600">Loading donation statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-50 rounded-lg">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Total Donations Over Time
        </h2>
        <p className="text-gray-600">
          {data.length > 0
            ? `Total: $${data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`
            : "No donation data available"}
        </p>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Amount ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #4f46e5",
                borderRadius: "8px",
                padding: "10px",
              }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
            <Legend />
            <Bar
              dataKey="amount"
              fill="#4f46e5"
              radius={[8, 8, 0, 0]}
              name="Donation Amount"
            />
            <Bar
              dataKey="count"
              fill="#818cf8"
              radius={[8, 8, 0, 0]}
              name="Number of Donations"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No donation data to display</p>
        </div>
      )}
    </div>
  );
};

export default DonationStats;

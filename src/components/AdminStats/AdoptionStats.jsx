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

const AdoptionStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/adoptions");

        if (response.data.success && response.data.data) {
          // Group adoptions by date
          const groupedData = groupAdoptionsByDate(response.data.data);
          setData(groupedData);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching adoptions:", err);
        setError("Failed to load adoption statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, []);

  const groupAdoptionsByDate = (adoptions) => {
    const grouped = {};

    adoptions.forEach((adoption) => {
      // Parse the date from adoption data
      const date = new Date(adoption.date || adoption.createdAt);
      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          count: 0,
          pending: 0,
          approved: 0,
        };
      }

      grouped[dateKey].count += 1;

      // Count by status if available
      if (adoption.status === "pending") {
        grouped[dateKey].pending += 1;
      } else if (adoption.status === "approved") {
        grouped[dateKey].approved += 1;
      }
    });

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
        <p className="text-lg text-gray-600">Loading adoption statistics...</p>
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
    <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Total Adoptions Over Time
        </h2>
        <p className="text-gray-600">
          {data.length > 0
            ? `Total: ${data.reduce((sum, item) => sum + item.count, 0)} adoptions`
            : "No adoption data available"}
        </p>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: "Count", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #059669",
                borderRadius: "8px",
                padding: "10px",
              }}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="#059669"
              radius={[8, 8, 0, 0]}
              name="Total Adoptions"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No adoption data to display</p>
        </div>
      )}
    </div>
  );
};

export default AdoptionStats;

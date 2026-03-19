import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosSecure from "../../api/axiosSecure";

const PetStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPets, setTotalPets] = useState(0);

  const COLORS = [
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#f97316",
    "#06b6d4",
  ];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/pets");

        if (response.data.success && response.data.data) {
          // Group pets by category
          const groupedData = groupPetsByCategory(response.data.data);
          setData(groupedData);
          setTotalPets(response.data.count);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pet statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const groupPetsByCategory = (pets) => {
    const grouped = {};

    pets.forEach((pet) => {
      const category = pet.category || "Unknown";

      if (!grouped[category]) {
        grouped[category] = {
          name: category,
          value: 0,
        };
      }

      grouped[category].value += 1;
    });

    // Convert to array and sort by value (descending)
    return Object.values(grouped).sort((a, b) => b.value - a.value);
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
        <p className="text-lg text-gray-600">Loading pet statistics...</p>
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
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Total Pets by Category
        </h2>
        <p className="text-gray-600">
          {data.length > 0
            ? `Total: ${totalPets} pets across ${data.length} categories`
            : "No pet data available"}
        </p>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #8b5cf6",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                  formatter={(value, name, props) => [
                    `${value} pets`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No pet data to display</p>
        </div>
      )}
    </div>
  );
};

export default PetStats;

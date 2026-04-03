import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";
import VetCard from "../components/Vetcard";

const Vets = () => {
  const { loading, setLoading } = useAuth();
  const [vets, setVets] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/vets")
      .then((res) => {
        setVets(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vets:", err);
        setLoading(false);
      });
  }, []);

  const handleDeleteVet = (id) => {
    setVets((prev) => prev.filter((vet) => vet._id !== id));
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Veterinarians
          </h1>
          <p className="text-gray-500">
            Meet our professional and experienced vets
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading vets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vets.map((vet) => (
              <VetCard key={vet._id} vet={vet} onDelete={handleDeleteVet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vets;

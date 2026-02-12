import React from "react";
import { useNavigate } from "react-router-dom";

const PetCard = ({ pet }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pet/${pet._id}`);
  };

  return (
    <div
      onClick={() => handleViewDetails(pet._id)}
      className="bg-white rounded-xs shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <img
          src={pet.image}
          alt={pet.pet_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x300?text=Pet+Image")
          }
        />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {pet.pet_name}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold">GENDER</p>
            <p className="text-sm font-bold text-gray-800">{pet.gender}</p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold">AGE</p>
            <p className="text-sm font-bold text-gray-800">{pet.age}</p>
          </div>
        </div>

        <button className="w-full border border-blue-500 cursor-pointer py-2 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PetCard;

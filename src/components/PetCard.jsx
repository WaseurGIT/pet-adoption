import React from "react";

const PetCard = ({ pet }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Dog: "bg-blue-100 text-blue-800",
      Cat: "bg-purple-100 text-purple-800",
      Rabbit: "bg-pink-100 text-pink-800",
      Bird: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
      
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <img
          src={pet.image}
          alt={pet.pet_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Pet+Image"}
        />
        
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(pet.category)} shadow-md`}>
          {pet.category}
        </div>

        {pet.vaccinated && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            ✓ Vaccinated
          </div>
        )}

        <button className="absolute bottom-3 right-3 bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors duration-200">
          ❤️
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          {pet.pet_name}
        </h3>
        <p className="text-sm text-gray-500 font-medium mb-3">
          {pet.breed}
        </p>

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

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-2">📍</span>
            <span>{pet.location}</span>
          </div>
          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
            ${pet.adoption_fee}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {pet.description}
        </p>
        
        <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PetCard;

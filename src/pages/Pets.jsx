import { useContext, useEffect, useState } from "react";
import PetCard from "../components/PetCard";
import { Link } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import { AuthContext } from "../context/AuthProvider";

const Pets = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const categories = ["All", "Dog", "Cat", "Rabbit", "Bird", "Hamster", "Fish"];

  const handleCategories = (category) => {
    // Filter pets based on the selected category
    axiosSecure
      .get("/pets")
      .then((res) => {
        const filteredPets =
          category === "All"
            ? res.data.data || res.data
            : (res.data.data || res.data).filter(
                (pet) => pet.category.toLowerCase() === category.toLowerCase(),
              );
        setPets(filteredPets);
      })
      .catch((error) => console.error("Error fetching pets:", error));
  };

  useEffect(() => {
    axiosSecure
      .get("/pets")
      .then((res) => {
        setPets(res.data.data || res.data);
      })
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 py-18 md:py-20 px-3 sm:px-6 md:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-10">
        Available Pets 🐾
      </h2>

      {user?.role === "admin" && (
        <div className="flex items-center justify-end mb-6 sm:mb-10 px-2 sm:px-0">
          <Link
            to="/addPet"
            className="bg-blue-600 text-white px-6 sm:px-8 md:px-12 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
          >
            + Add New Pet
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 px-2">
        {categories.map((category) => (
          <button
            onClick={() => handleCategories(category)}
            key={category}
            className="bg-gray-200 text-gray-800 px-4 sm:px-6 md:px-8 py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold cursor-pointer hover:bg-gray-300 transition-colors duration-300 hover:text-orange-500 whitespace-nowrap"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-2">
        {pets.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 mb-2 sm:mb-4">
              No Pets Found 🐾
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              There are no pets available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;

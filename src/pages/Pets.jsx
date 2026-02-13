import { useEffect, useState } from "react";
import PetCard from "../components/PetCard";
import axios from "axios";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const categories = ["All", "Dog", "Cat", "Rabbit", "Bird"];

  const handleCategories = (category) => {
    // Filter pets based on the selected category
    axios.get("http://localhost:5000/pets")
      .then((res) => {
        const filteredPets = category === "All" ? res.data.data : res.data.data.filter((pet) => pet.category === category);
        setPets(filteredPets);
      })
      .catch((error) => console.error("Error fetching pets:", error));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/pets")
      .then((res) => setPets(res.data.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 py-26 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Available Pets 🐾
      </h2>

      <div className="flex items-center justify-center gap-5 my-2">
        {categories.map((category) => (
          <div
            onClick={() => handleCategories(category)}
            key={category}
            className="bg-gray-200 text-gray-800 px-12 py-2 rounded-full text-sm font-semibold mr-2 mb-4 cursor-pointer hover:bg-gray-300 transition-colors duration-300 hover:text-orange-500"
          >
            {category}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default Pets;

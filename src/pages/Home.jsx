import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import PetCard from "../components/PetCard";

const Home = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch("/pets.json")
      .then((response) => response.json())
      .then((data) => setPets(data.slice(0, 3)))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  return (
    <div>
      <Banner />
      <div className="min-h-screen bg-orange-50 py-26 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Featured Pets 🐾
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-12">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

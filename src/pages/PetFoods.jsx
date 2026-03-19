import React, { useState, useEffect } from "react";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";

const PetFoods = () => {
  const [petFoods, setPetFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, role } = useAuth();

  useEffect(() => {
    const fetchPetFoods = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/petfoods");

        if (response.data.success && response.data.data) {
          setPetFoods(response.data.data);
          setError(null);
        } else {
          setError("Failed to load pet foods");
        }
      } catch (err) {
        console.error("Error fetching pet foods:", err);
        setError("Failed to load pet foods");
      } finally {
        setLoading(false);
      }
    };

    fetchPetFoods();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pet food?")) {
      try {
        const response = await axiosSecure.delete(`/petfoods/${id}`);

        if (response.data.success) {
          setPetFoods(petFoods.filter((food) => food._id !== id));
        } else {
          alert("Failed to delete pet food");
        }
      } catch (err) {
        console.error("Error deleting pet food:", err);
        alert("Error deleting pet food");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading pet foods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-18 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pet Foods</h1>
          <p className="text-gray-600">
            {petFoods.length} {petFoods.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>

        {petFoods.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-500">No pet foods available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petFoods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                {food.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {food.name}
                      </h3>
                      {food.brand && (
                        <p className="text-sm text-gray-500">{food.brand}</p>
                      )}
                    </div>
                    {food.rating && (
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="font-semibold text-gray-900">{food.rating}</span>
                        </div>
                        {food.reviewsCount && (
                          <p className="text-xs text-gray-500">({food.reviewsCount} reviews)</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  {food.price && (
                    <p className="text-2xl font-bold text-green-600 mb-4">
                      ${food.price.toFixed(2)}
                    </p>
                  )}

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                    {food.category && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Category</p>
                        <p className="text-sm text-gray-900">{food.category}</p>
                      </div>
                    )}
                    {food.foodType && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Type</p>
                        <p className="text-sm text-gray-900">{food.foodType}</p>
                      </div>
                    )}
                    {food.flavor && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Flavor</p>
                        <p className="text-sm text-gray-900">{food.flavor}</p>
                      </div>
                    )}
                    {food.weight && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Weight</p>
                        <p className="text-sm text-gray-900">{food.weight}</p>
                      </div>
                    )}
                  </div>

                  {/* Nutritional Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                    {food.protein !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Protein</p>
                        <p className="text-sm text-gray-900">{food.protein}%</p>
                      </div>
                    )}
                    {food.fat !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Fat</p>
                        <p className="text-sm text-gray-900">{food.fat}%</p>
                      </div>
                    )}
                    {food.calories !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Calories</p>
                        <p className="text-sm text-gray-900">{food.calories} kcal</p>
                      </div>
                    )}
                    {food.stock !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Stock</p>
                        <p className={`text-sm font-semibold ${food.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {food.stock > 0 ? `${food.stock} left` : 'Out of stock'}
                        </p>
                      </div>
                    )}
                  </div>
                  {user && role === "admin" && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetFoods;

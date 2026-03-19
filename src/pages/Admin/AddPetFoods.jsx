import { useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddPetFoods = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const brand = form.brand.value;
    const category = form.category.value;
    const foodType = form.foodType.value;
    const flavor = form.flavor.value;
    const weight = form.weight.value;
    const price = parseFloat(form.price.value);
    const rating = parseFloat(form.rating.value);
    const protein = parseFloat(form.protein.value);
    const fat = parseFloat(form.fat.value);
    const calories = parseInt(form.calories.value);
    const stock = parseInt(form.stock.value);
    const image = form.image.value;

    const formData = {
      name,
      brand,
      category,
      foodType,
      flavor,
      weight,
      price,
      rating,
      protein,
      fat,
      calories,
      stock,
      image,
    };

    try {
      const res = await axiosSecure.post("/petFoods", formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Pet food added successfully!",
      });
      form.reset();
      navigate("/petFoods");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add pet food",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 py-30 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Pet Food</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="input"
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          className="input"
          required
        />

        <select type="text" name="category" className="input">
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
        </select>

        <select type="text" name="foodType" className="input">
          <option>Dry</option>
          <option>Wet</option>
          <option>Treat</option>
        </select>

        <input
          type="text"
          name="flavor"
          placeholder="Flavor"
          className="input"
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (e.g. 2kg)"
          className="input"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="input"
          required
        />
        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating (0-5)"
          className="input"
        />

        <input
          type="number"
          name="protein"
          placeholder="Protein (%)"
          className="input"
        />
        <input
          type="number"
          name="fat"
          placeholder="Fat (%)"
          className="input"
        />

        <input
          type="number"
          name="calories"
          placeholder="Calories"
          className="input"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="input"
        />

        <input
          name="image"
          placeholder="Image URL"
          className="col-span-2 input"
        />

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Pet Food
        </button>
      </form>
    </div>
  );
};

export default AddPetFoods;

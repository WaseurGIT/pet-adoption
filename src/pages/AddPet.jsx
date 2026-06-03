import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosSecure from "../api/axiosSecure";

const AddPet = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isImgbbLink = (value) => {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" 
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const pet_name = form.pet_name.value;
    const category = form.category.value;
    const breed = form.breed.value;
    const age = form.age.value;
    const gender = form.gender.value;
    const color = form.color.value;
    const size = form.size.value;
    const health_status = form.health_status.value;
    const adoption_fee = form.adoption_fee.value;
    const location = form.location.value;
    const description = form.description.value;
    const image = form.image.value.trim();

    const formData = {
      pet_name,
      category,
      breed,
      age,
      gender,
      color,
      size,
      health_status,
      adoption_fee,
      location,
      description,
      image,
    };

    setError("");
    setSuccess("");

    if (
      !formData.pet_name ||
      !formData.category ||
      !formData.breed ||
      !formData.age ||
      !formData.gender ||
      !formData.color ||
      !formData.size ||
      !formData.health_status ||
      !formData.adoption_fee ||
      !formData.location ||
      !formData.description ||
      !formData.image
    ) {
      setError("All fields are required");
      return;
    }

    if (!isImgbbLink(formData.image)) {
      setError("Please provide a valid imgbb link (ibb.co or i.ibb.co only)");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosSecure.post("/pets", formData);
      console.log("Pet added:", response.data);
      setSuccess("Pet added successfully");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Pet added successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/pets");
    } catch (err) {
      console.error("Error submitting pet:", err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-26 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 transition"
        >
          ← Back
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Add New Pet
          </h2>
          <p className="text-gray-500 mb-8 text-center">
            Fill in the details below to add a new pet
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imgbb Image Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="image"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                placeholder="https://i.ibb.co/... or https://ibb.co/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pet_name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                placeholder="Enter pet name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
              >
                <option value="">Select category</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Hamster">Hamster</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="breed"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  placeholder="Enter breed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="age"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  placeholder="e.g., 2 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  placeholder="e.g., Golden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                >
                  <option value="">Select size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Extra Large">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="health_status"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                >
                  <option value="">Select health status</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Minor Health Issues">
                    Minor Health Issues
                  </option>
                  <option value="Special Care Required">
                    Special Care Required
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  placeholder="e.g., Dhaka"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adoption Fee <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="adoption_fee"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  placeholder="Enter adoption fee"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="vaccinated"
                id="vaccinated"
                // onChange={(e) =>
                //   setFormData((prev) => ({
                //     ...prev,
                //     vaccinated: e.target.checked,
                //   }))
                // }
                className="w-5 h-5 border-2 border-gray-200 rounded focus:border-purple-500 cursor-pointer"
              />
              <label
                htmlFor="vaccinated"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Vaccinated
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available"
                id="available"
                // onChange={(e) =>
                //   setFormData((prev) => ({
                //     ...prev,
                //     available: e.target.checked,
                //   }))
                // }
                className="w-5 h-5 border-2 border-gray-200 rounded focus:border-purple-500 cursor-pointer"
              />
              <label
                htmlFor="available"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Available for Adoption
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition resize-none"
                placeholder="Enter detailed description about the pet"
              ></textarea>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Pet..." : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;

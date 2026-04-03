import React, { useState } from "react";
import axiosSecure from "../api/axiosSecure";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddVet = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVet = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const experience = form.experience.value;
    const address = form.address.value;
    const specialization = form.specialization.value;
    const bio = form.bio.value;

    const formData = {
      name,
      profileImage,
      email,
      phone,
      experience,
      address,
      specialization,
      bio,
      createdAt: new Date(),
    };

    axiosSecure
      .post("/vets", formData)
      .then((response) => {
        console.log("Vet added successfully:", response.data);
        Swal.fire({
          icon: "success",
          title: "Vet Added",
          text: "The veterinarian has been added successfully!",
          timer: 2000,
        });
        form.reset();
        navigate("/dashboard/admin/vets");
      })
      .catch((error) => {
        console.error("Error adding vet:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add veterinarian.",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 mt-15">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Veterinarian
        </h2>

        <form
          onSubmit={handleAddVet}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              placeholder="e.g. 5"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Surgery, Dentistry"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              name="profileImage"
              onChange={handleProfileImageChange}
              placeholder="https://example.com/profileImage.jpg"
              className="w-full border rounded-lg px-3 py-2 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Short Bio</label>
            <textarea
              rows="3"
              name="bio"
              placeholder="Write a short bio..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add Vet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVet;

import axios from "axios";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AdoptionPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    occupation: "",
    homeType: "apartment",
    ownRent: "own",
    yearsAtHome: "",
    landlordAllowsPets: "yes",
    adultsInHome: "",
    childrenAges: "",
    otherPets: "no",
    otherPetsDetails: "",
    workSchedule: "",
    exerciseTime: "",
    vetName: "",
    vetPhone: "",
    vetEmail: "",
    adoptionReason: "",
    agreeTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    const adoptionData = {
      petId,
      ...formData,
    }

   try {
    const response = await axios.post(
      "http://localhost:5000/adoptions",
      adoptionData
    );

    console.log("Adoption application submitted:", response.data);

    setSubmitted(true);
    setLoading(false);

    setTimeout(() => {
      navigate("/pets");
    }, 3000);

  } catch (error) {
    console.error("Error submitting adoption application:", error);
    setLoading(false);
  }
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/pets");
      }, 3000);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for submitting your adoption application. We'll review it
            and get back to you soon.
          </p>
          <p className="text-sm text-gray-500">Redirecting to pets page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-26 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🐾 Pet Adoption Application
          </h1>
          <p className="text-gray-600 text-lg">
            Complete this form to apply for pet adoption. We want to ensure
            every pet finds a loving home!
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-8"
        >
          {/* Section 1: Personal Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              👤 Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Your profession"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              🏠 Address Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Living Situation */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              🏡 Living Situation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="homeType"
                  value={formData.homeType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="farm">Farm</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Own or Rent? <span className="text-red-500">*</span>
                </label>
                <select
                  name="ownRent"
                  value={formData.ownRent}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="own">Own</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years at Current Home <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="yearsAtHome"
                  value={formData.yearsAtHome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Landlord Allows Pets?
                </label>
                <select
                  name="landlordAllowsPets"
                  value={formData.landlordAllowsPets}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not-applicable">N/A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Household Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              👨‍👩‍👧‍👦 Household Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Adults <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="adultsInHome"
                  value={formData.adultsInHome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Children Ages (if any)
                </label>
                <input
                  type="text"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="e.g., 5, 8, 12"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Do you have other pets? <span className="text-red-500">*</span>
                </label>
                <select
                  name="otherPets"
                  value={formData.otherPets}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {formData.otherPets === "yes" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Please describe your other pets
                  </label>
                  <textarea
                    name="otherPetsDetails"
                    value={formData.otherPetsDetails}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Type, breed, age, temperament..."
                  ></textarea>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Pet Care Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              🐾 Pet Care & Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Schedule & Pet Care Time
                </label>
                <textarea
                  name="workSchedule"
                  value={formData.workSchedule}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="How much time will you spend with the pet daily?"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exercise & Activity Plans
                </label>
                <textarea
                  name="exerciseTime"
                  value={formData.exerciseTime}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="How will you provide exercise and enrichment?"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 6: Veterinary Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              🏥 Veterinary Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Veterinarian Name
                </label>
                <input
                  type="text"
                  name="vetName"
                  value={formData.vetName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Dr. Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Veterinary Phone
                </label>
                <input
                  type="tel"
                  name="vetPhone"
                  value={formData.vetPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Veterinary Email
                </label>
                <input
                  type="email"
                  name="vetEmail"
                  value={formData.vetEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="vet@clinic.com"
                />
              </div>
            </div>
          </div>

          {/* Section 7: Adoption Reason */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-300">
              💭 Why Do You Want to Adopt?
            </h2>
            <textarea
              name="adoptionReason"
              value={formData.adoptionReason}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Tell us about your motivation for adopting and what kind of pet experience you're looking for..."
            ></textarea>
          </div>

          {/* Agreement */}
          <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="w-5 h-5 mt-1 text-orange-500 focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-gray-700">
                I agree to a home visit if required and understand that adoption
                is a lifetime commitment. I also agree to return the pet if it's
                not a suitable match. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.agreeTerms}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionPage;

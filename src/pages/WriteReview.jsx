
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosSecure from "../api/axiosSecure";

const WriteReview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    experience: "",
    recommend: "yes",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Review must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const data = {
      name: formData.name,
      email: formData.email,
      rating: formData.rating,
      experience: formData.experience,
      recommend: formData.recommend,
      message: formData.message,
    };

    axiosSecure
      .post("http://localhost:5000/reviews", data)
      .then((response) => {
        console.log("Review submitted:", response.data);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Thank you for your review!",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/reviews");
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4 animate-bounce">✓</div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your review has been submitted successfully. We appreciate your
            feedback!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to reviews page...
          </p>
        </div>
      </div>
    );
  }

  const StarRating = ({ name, label, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                [name]: star,
              }))
            }
            className={`text-3xl transition-all transform hover:scale-110 ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-600 mt-2">{value} out of 5 stars</div>
    </div>
  );

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    required,
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
          errors[name]
            ? "border-red-500 focus:border-red-600"
            : "border-gray-300 focus:border-blue-500"
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-26 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate("/reviews")}
            className="mb-6 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            ← Back to Reviews
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            ✏️ Write Your Review
          </h1>
          <p className="text-gray-600 text-lg">
            Share your pet adoption experience and help other families find
            their perfect match
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-8"
        >
          {/* Personal Information Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-300">
              👤 About You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-300">
              ⭐ Your Experience
            </h2>

            {/* Overall Experience */}
            <div className="mb-6">
              <StarRating
                name="rating"
                label="Overall Experience"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            {/* Would You Recommend */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Would you recommend us to others?
              </label>
              <div className="flex gap-4">
                {["yes", "no"].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-6 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.recommend === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommend"
                      value={option}
                      checked={formData.recommend === option}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-800 capitalize">
                      {option === "yes" ? "Yes! Absolutely 👍" : "No 👎"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Text Experience */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How would you describe your experience?
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select an option</option>
                <option value="excellent">
                  Excellent - Exceeded expectations
                </option>
                <option value="great">Great - Very satisfied</option>
                <option value="good">Good - Satisfied</option>
                <option value="fair">Fair - Average experience</option>
                <option value="poor">Poor - Needs improvement</option>
              </select>
            </div>
          </div>

          {/* Review Message Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-300">
              💬 Your Review
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tell us about your adoption journey{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Share your experience, how well the process went, how your pet has settled in, and any advice for future adopters..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                  errors.message
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {formData.message.length} characters (minimum 10 required)
              </p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <span className="font-bold">📋 Privacy Notice:</span> Your review
              will be published on our website. We may edit reviews for clarity
              and remove inappropriate content. Your email will not be
              published.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Review ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;

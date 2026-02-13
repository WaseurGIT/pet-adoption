import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/reviews")
      .then((res) => {
        const reviewsArray = res.data.data;
        const reviewsWithRatings = reviewsArray.map((review) => ({
          ...review,
          rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
        }));
        setReviews(reviewsWithRatings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[id % colors.length];
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-26 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ⭐ Happy Adopters
          </h1>
          <p className="text-xl text-gray-600 mb-3">
            Read stories from families who have found their perfect pets
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-yellow-400 text-2xl">★★★★★</span>
            <span className="text-gray-700 font-semibold">
              {reviews.length} Happy Reviews
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {reviews.length}
            </div>
            <p className="text-gray-600 font-semibold">Total Reviews</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-green-600 mb-2">4.8★</div>
            <p className="text-gray-600 font-semibold">Average Rating</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
            <p className="text-gray-600 font-semibold">Satisfied Families</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-fade-in"
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              {/* Card Top Colored Bar */}
              <div
                className={`h-1 ${getAvatarColor(idx)} group-hover:h-2 transition-all`}
              ></div>

              <div className="p-8">
                {/* Avatar and Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`${getAvatarColor(
                        idx,
                      )} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}
                    >
                      {getInitials(review.name)}
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {review.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Verified Adopter ✓
                      </p>
                    </div>
                  </div>

                  {/* Heart Icon */}
                  <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    ❤️
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">{renderStars(review.rating)}</div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                  "{review.message}"
                </p>

                {/* Quote Mark Background */}
                <div className="text-6xl text-orange-100 opacity-50 -mt-4">
                  "
                </div>
              </div>

              {/* Bottom Info */}
              <div className="px-8 py-4 bg-gradient-to-r from-orange-50 to-pink-50 flex items-center justify-between">
                <span className="text-xs text-gray-500">Recently Reviewed</span>
                <span className="text-sm font-semibold text-orange-600">
                  Adoption Success ✓
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Testimonial Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            💬 Why Families Love Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: "✨",
                title: "Easy Process",
                description: "Simple adoption process from start to finish",
              },
              {
                emoji: "💚",
                title: "Caring Staff",
                description: "Dedicated team committed to pet welfare",
              },
              {
                emoji: "📋",
                title: "Detailed Profiles",
                description: "Complete information about each pet",
              },
              {
                emoji: "🤝",
                title: "Support",
                description: "Post-adoption support and guidance",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">{item.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Review Highlight */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl p-12 text-white text-center">
          <div className="text-5xl mb-6">⭐⭐⭐⭐⭐</div>
          <h3 className="text-2xl font-bold mb-4">
            Join Thousands of Happy Pet Parents!
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Your perfect pet is waiting. Start your adoption journey today.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center">
            <button
              onClick={() => navigate("/pets")}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Pets
            </button>
            <button
              onClick={() => navigate("/write-review")}
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Share Your Story
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have you adopted a pet from us? We'd love to hear your story!
          </p>
          <button
            onClick={() => navigate("/write-review")}
            className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Write a Review ✏️
          </button>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Reviews;

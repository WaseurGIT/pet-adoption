import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DonationPage = () => {
  const navigate = useNavigate();
  const [activeAmount, setActiveAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const donationOptions = [
    { amount: 10, label: "$10", impact: "Feed 1 dog for a week" },
    { amount: 25, label: "$25", impact: "Provide medical check-up" },
    { amount: 50, label: "$50", impact: "One month shelter supplies" },
    { amount: 100, label: "$100", impact: "Vaccination for 2 pets" },
    { amount: 250, label: "$250", impact: "Emergency care for pet" },
    { amount: 500, label: "$500", impact: "Complete pet adoption support" },
  ];

  const impacts = [
    {
      emoji: "🏥",
      title: "Medical Care",
      description: "Veterinary care, vaccinations, and health treatments",
    },
    {
      emoji: "🥗",
      title: "Nutrition",
      description: "Quality food and nutrition for all our rescue pets",
    },
    {
      emoji: "🏠",
      title: "Shelter",
      description: "Safe, comfortable shelter facilities and maintenance",
    },
    {
      emoji: "👨‍⚕️",
      title: "Staff",
      description: "Caring staff members dedicated to animal welfare",
    },
  ];

  const handleAmountClick = (amount) => {
    setActiveAmount(amount);
    setCustomAmount("");
    setDonationAmount(amount);
  };

  const handleCustomAmount = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setCustomAmount(amount);
    setDonationAmount(amount);
    setActiveAmount(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (donationAmount <= 0) {
      alert("Please select or enter a donation amount");
      return;
    }
    setLoading(true);

    try {
      const donationData = {
        amount: donationAmount,
        paymentMethod,
        ...formData,
      };

      axios.post("http://localhost:5000/donations", donationData);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Thank you for your donation of $${donationAmount.toFixed(2)}!`,
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/");

      // Simulate payment processing
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Donation Failed",
        text: error.message,
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4 animate-bounce">💝</div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-2 text-lg font-semibold">
            Your donation of ${donationAmount.toFixed(2)} has been received
          </p>
          <p className="text-gray-500 mb-6">
            A confirmation email has been sent to {formData.email}. Your
            generosity will help us continue our mission to rescue and care for
            animals in need.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <p className="text-sm text-blue-700">
              🙏 We'll send you updates on how your donation helps our rescues!
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to home page in 4 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-26 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            💝 Make a Difference
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Your donation helps us rescue, care for, and find loving homes for
            animals in need.
          </p>
          <div className="inline-block bg-blue-100 border-2 border-blue-300 rounded-lg px-6 py-3">
            <p className="text-blue-800 font-semibold">
              100% of donations go directly to animal care
            </p>
          </div>
        </div>

        <div className="mb-16">
          {/* Donation Form - Main Section */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              {/* Donation Amount Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-300">
                  💰 Select Donation Amount
                </h2>

                {/* Predefined Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {donationOptions.map((option) => (
                    <button
                      key={option.amount}
                      type="button"
                      onClick={() => handleAmountClick(option.amount)}
                      className={`p-4 rounded-xl font-bold text-center transition-all duration-300 border-2 ${
                        activeAmount === option.amount
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-800 hover:border-blue-300"
                      }`}
                    >
                      <div className="text-lg">{option.label}</div>
                      <div className="text-xs mt-1 text-gray-600">
                        {option.impact}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomAmount}
                      placeholder="Enter custom amount"
                      step="0.01"
                      min="1"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-bold"
                    />
                  </div>
                </div>

                {/* Display Current Amount */}
                {donationAmount > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                    <p className="text-gray-700">
                      <span className="font-semibold">Donation Amount: </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${donationAmount.toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-300">
                  💳 Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: "credit-card",
                      label: "Credit/Debit Card",
                      icon: "💳",
                    },
                    { id: "paypal", label: "PayPal", icon: "🅿️" },
                    { id: "bank", label: "Bank Transfer", icon: "🏦" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-2xl ml-3">{method.icon}</span>
                      <span className="ml-3 font-semibold text-gray-800">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Donor Information Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-300">
                  👤 Your Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Share why you support our mission..."
                    ></textarea>
                  </div>
                  <label className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleFormChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700">
                      Make this donation anonymous
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || donationAmount <= 0}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                {loading
                  ? "Processing Donation..."
                  : `Donate $${donationAmount.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Impact Cards Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🌟 What Your Donation Supports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((impact, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200 text-center hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">{impact.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {impact.title}
                </h3>
                <p className="text-sm text-gray-600">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            ❓ Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Is my donation secure?",
                a: "Yes, all donations are processed through secure, encrypted payment gateways.",
              },
              {
                q: "Can I donate monthly?",
                a: "Yes! Set up a recurring donation to provide continuous support.",
              },
              {
                q: "Is my donation tax-deductible?",
                a: "Yes, we're a registered 501(c)(3). Full receipts are sent to all donors.",
              },
              {
                q: "Can I specify how my donation is used?",
                a: "Contact us at donate@petcare.org to discuss designated giving.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;

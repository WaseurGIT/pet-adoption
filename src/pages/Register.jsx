import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import axiosSecure from "../api/axiosSecure";

const Register = () => {
  const { registerUser, setLoading, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      const result = await registerUser(email, password, name);

      const userData = {
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        role: "user",
        createdAt: new Date().toISOString().split("T")[0],
      };

      await axiosSecure.post("/users", userData);

      const tokenResponse = await axiosSecure.post("/jwt", {
        email: result.user.email,
      });

      localStorage.setItem("access-token", tokenResponse.data.token);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Welcome ${name}! Account created successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });

      form.reset();
      navigate("/dashboard/user");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Unable to connect to the server. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Registration failed. Please try again.",
        });
      }
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-26">
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🐶</div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm">
              Join us and find your perfect companion
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {/* {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordChecks.length ? (
                      <FiCheck className="text-green-500 font-bold" />
                    ) : (
                      <FiX className="text-red-500 font-bold" />
                    )}
                    <span
                      className={
                        passwordChecks.length
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordChecks.special ? (
                      <FiCheck className="text-green-500 font-bold" />
                    ) : (
                      <FiX className="text-red-500 font-bold" />
                    )}
                    <span
                      className={
                        passwordChecks.special
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      One special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )} */}
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-gray-300"></div>
            <span className="text-xs text-gray-400 uppercase font-semibold">
              or
            </span>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-gray-300"></div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:text-blue-700 underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Register;

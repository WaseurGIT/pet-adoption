import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiHeart, FiLogOut } from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const navLinks = (
    <>
      <Link to="/" onClick={() => setIsOpen(false)} className="nav-link">
        Home
      </Link>
      <Link to="/pets" onClick={() => setIsOpen(false)} className="nav-link">
        Pets
      </Link>
      <Link to="/reviews" onClick={() => setIsOpen(false)} className="nav-link">
        Reviews
      </Link>
      {user && user.role === "admin" && (
        <Link to="/admin/dashboard" className="nav-link">
          Dashboard
        </Link>
      )}
      <Link
        to="/donation"
        onClick={() => setIsOpen(false)}
        className="nav-link"
      >
        Donate
      </Link>
      {!user && (
        <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link">
          Login
        </Link>
      )}
    </>
  );

  // Generate avatar with initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-orange-500"
          >
            <FiHeart className="text-2xl" />
            PetAdopt
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center text-gray-700 font-medium">
            {navLinks}
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                {/* User Avatar with Name */}
                <div className="relative">
                  <div
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(user.displayName)
                      )}
                    </div>
                    {/* Name below avatar */}
                    <p className="text-xs font-semibold text-gray-700 mt-1 whitespace-nowrap">
                      {user.displayName
                        ? user.displayName.split(" ")[0]
                        : "User"}
                    </p>
                  </div>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b text-gray-700 text-sm">
                        <p className="font-semibold">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsOpen(false);
                        }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm flex items-center gap-2"
                      >
                        <FiLogOut className="cursor-pointer" size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition text-red-600 hover:shadow"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-2xl text-gray-700"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col px-4 py-4 gap-4 text-gray-700 font-medium">
            {navLinks}
            {user && (
              <>
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-red-600 flex items-center gap-2 hover:text-red-700"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tailwind Reusable Class */}
      <style>
        {`
          .nav-link {
            position: relative;
            transition: 0.3s;
          }
          .nav-link:hover {
            color: #f97316;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;

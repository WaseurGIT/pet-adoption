import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiHeart } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = (
    <>
      <Link to="/" onClick={() => setIsOpen(false)} className="nav-link">
        Home
      </Link>
      <Link to="/pets" onClick={() => setIsOpen(false)} className="nav-link">
        Pets
      </Link>
      <Link
        to="/adoption"
        onClick={() => setIsOpen(false)}
        className="nav-link"
      >
        Adoption
      </Link>
      <Link
        to="/donation"
        onClick={() => setIsOpen(false)}
        className="nav-link"
      >
        Donate
      </Link>
      <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link">
        Login
      </Link>
    </>
  );

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

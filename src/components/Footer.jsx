import { Link } from "react-router-dom";
import { FiHeart, FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
              <FiHeart className="text-orange-500" />
              PetAdopt
            </h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Helping pets find loving homes. Join us in making a difference
              through adoption and donation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pets" className="footer-link">
                  Pets
                </Link>
              </li>
              <li>
                <Link to="/adoption" className="footer-link">
                  Adoption
                </Link>
              </li>
              <li>
                <Link to="/donation" className="footer-link">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4 text-xl">
              <a href="#" className="social-icon">
                <FiFacebook />
              </a>
              <a href="#" className="social-icon">
                <FiTwitter />
              </a>
              <a href="#" className="social-icon">
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PetAdopt. All rights reserved.
        </div>
      </div>

      {/* Reusable Tailwind classes */}
      <style>
        {`
          .footer-link {
            transition: 0.3s;
          }
          .footer-link:hover {
            color: #f97316;
          }
          .social-icon {
            transition: 0.3s;
          }
          .social-icon:hover {
            color: #f97316;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;

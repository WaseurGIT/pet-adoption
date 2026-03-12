import { Outlet } from "react-router-dom";
// import UserSidebar from "../../components/user/UserSidebar";
import { useState } from "react";
import UserSidebar from "./UserSidebar";

const UserDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-40 p-2 bg-blue-500 text-white rounded-lg"
      >
        {isSidebarOpen ? "✕ Close" : "☰ Menu"}
      </button>

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-blue-100 z-40 md:static md:h-auto md:w-64 md:z-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <UserSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-16 md:mt-0 px-3 sm:px-4 md:px-6 py-4 md:py-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;
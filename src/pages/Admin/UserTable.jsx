import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import Swal from "sweetalert2";

const UserTable = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/users")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/users/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire("Deleted!", "User has been deleted.", "success");

              const remainingUsers = allUsers.filter((user) => user._id !== id);
              setAllUsers(remainingUsers);
            }
          })
          .catch((err) => console.error(err));
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">All Users</h1>

        {allUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-base sm:text-lg">No users found</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {allUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Name</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800 break-words">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</p>
                      <p className="text-xs sm:text-sm text-gray-700 break-all">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Created At</p>
                      <p className="text-xs sm:text-sm text-gray-700 break-all">{user.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Role</p>
                      <span className="inline-block px-3 py-1 mt-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {user.role || "user"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg bg-white">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Created At</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-center font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {allUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 font-medium text-gray-700 w-12">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{user.createdAt}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                          {user.role || "user"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserTable;

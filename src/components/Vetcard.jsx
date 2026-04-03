import axiosSecure from "../api/axiosSecure";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const VetCard = ({ vet, onDelete }) => {
  const { user, role } = useAuth();
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This vet will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/vets/${vet._id}`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Vet has been deleted successfully.",
              timer: 2000,
              showConfirmButton: false,
            });
            onDelete(vet._id);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete vet.",
            });
          });
      }
    });
  };

  const {
    name,
    profileImage,
    email,
    phone,
    experience,
    address,
    specialization,
    bio,
  } = vet;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
      <div className="h-56 w-full overflow-hidden">
        <img
          src={profileImage || "https://via.placeholder.com/300"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-blue-500 font-medium">{specialization}</p>
        </div>

        <p className="text-sm text-gray-600">
          🩺 Experience: <span className="font-medium">{experience} years</span>
        </p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>📧 {email}</p>
          <p>📞 {phone}</p>
          <p>📍 {address}</p>
        </div>

        <p className="text-sm text-gray-500 line-clamp-3">{bio}</p>

        {user && role === "admin" && (
          <div className="pt-3">
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete Vet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetCard;

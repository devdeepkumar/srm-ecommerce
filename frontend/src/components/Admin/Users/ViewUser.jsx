import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Loader";
import { viewUser, changeUserRole, removeSuccess, removeError } from "../../../features/admin/adminSlice";

const ViewUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user, loading, success, error } = useSelector((state) => state.admin);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [role, setRole] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("You are not logged in. Please login.");
      navigate("/admin/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(viewUser(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);


  const handleRoleChange = () => {
    if (role !== user.role) {
      dispatch(changeUserRole({ userId: id, role }))
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("User role updated successfully");
      dispatch(viewUser(id));
      dispatch(removeSuccess());
      navigate("/admin/users");
    }

    if (error) {
      console.error(error);
      toast.error(error || "Failed to update user role");
      dispatch(removeError());

    }
  }, [dispatch, error, id, navigate, success]);


  if (loading) return <Loader />;
  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center">
          <img
            src={
              user.avatar?.url ||
              "https://res.cloudinary.com/demo/image/upload/sample.jpg"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto border object-cover"
          />
          <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
          <p className="text-gray-600">{user?.role?.toUpperCase()}</p>
        </div>

        {/* Form Fields */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="text"
              value={user.email}
              readOnly
              className="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none cursor-default"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">User ID</label>
            <input
              type="text"
              value={user._id}
              readOnly
              className="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none cursor-default"
            />
          </div>

          {user.createdAt && (
            <div>
              <label className="block text-sm text-gray-600">Joined</label>
              <input
                type="text"
                value={new Date(user.createdAt).toLocaleDateString()}
                readOnly
                className="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100 focus:outline-none cursor-default"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600">Change Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleRoleChange}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;

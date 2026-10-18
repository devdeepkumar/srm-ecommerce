
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteUser, fetchUsers, removeError, removeSuccess } from "../../../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../../Loader";
import { Link } from "react-router-dom";

const UsersPage = () => {
  // const [users, setUsers] = useState(sampleUsers);

  const dispatch = useDispatch();
  // const navigate= useNavigate()
  const { users, error, success, loading } = useSelector(
    (state) => state.admin
  );

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle success & error notifications
  useEffect(() => {
    if (success) dispatch(removeSuccess());
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [success, error, dispatch]);





  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("🗑️ User deleted successfully");
          dispatch(removeSuccess());
          // Optionally, refetch users
          dispatch(fetchUsers());
        } else {
          toast.error("Failed to delete user");
        }
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">👤 Users</h1>
      <p className="text-gray-600 mb-6">Manage all users here.</p>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Avatar
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={user.avatar?.url}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-bold ${user.role === "admin" ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="p-2 rounded-full hover:bg-blue-100"
                    >
                      <VisibilityIcon
                        fontSize="small"
                        className="text-blue-600"
                      />
                    </Link>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 rounded-full hover:bg-red-100"
                    >
                      <DeleteIcon fontSize="small" className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;

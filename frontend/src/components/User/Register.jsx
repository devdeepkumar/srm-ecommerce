import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, removeError, removeSuccess } from "../../features/user/userSlice";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = user;

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg"
  );

  const { success, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  }, []);

  const handleAvatar = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!username || !email || !password) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.set("username", username);
      formData.set("email", email);
      formData.set("password", password);
      if (avatar) {
        formData.set("avatar", avatar);
      }

      dispatch(registerUser(formData));
    },
    [dispatch, username, email, password, avatar]
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Registration Success");
      dispatch(removeSuccess());
      navigate("/");
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[75vh]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <PersonAddOutlinedIcon sx={{ fontSize: 26 }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Join us for seamless shopping and order tracking
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleFormSubmit}
          autoComplete="off"
          encType="multipart/form-data"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <img
              src={avatarPreview}
              alt="User avatar preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-xs"
            />
            <label className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-amber-600 transition">
              <span>Choose Profile Photo</span>
              <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleAvatar}
                className="hidden"
              />
            </label>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={username}
              required
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              required
              onChange={handleInputChange}
              placeholder="name@example.com"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              required
              autoComplete="new-password"
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="text-center pt-4 text-xs sm:text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/user/login"
            className="font-bold text-gray-900 hover:text-amber-600 transition underline ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

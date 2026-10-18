import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserProfile } from "../../features/user/userSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You are not logged in. Please login.");
      navigate("/user/login");
    } else if (user) {
      setFormData({ name: user.name, email: user.email });
      setAvatarPreview(user.avatar?.url || "");
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    if (avatar) {
      updatedData.append("avatar", avatar);
    }

    dispatch(updateUserProfile(updatedData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully");
        dispatch(fetchUserProfile())
          .unwrap()
          .then(() => {
            navigate("/user/profile");
          });
      })
      .catch((err) => {
        toast.error(err || "Failed to update profile");
      });
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[75vh]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 max-w-md w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">
          Edit Profile
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
          Update your account details and profile picture
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <img
              src={
                avatarPreview ||
                "https://res.cloudinary.com/demo/image/upload/sample.jpg"
              }
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-xs"
            />
            <label className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-amber-600 transition">
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleInputChange}
              placeholder="Your email"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

import User from "../models/user.model.js";
import asyncHandler from "../custom/asyncHandler.js";
import ExpressError from "../custom/ExpressError.js";
import crypto from "crypto";
import sendEmail from "../custom/sendEmail.js";
import { cloudinary } from "../custom/cloudinary.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


// Helper: Set cookie with token
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  const isProduction = process.env.NODE_ENV === "production";
  const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");

  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days in ms
    httpOnly: true,
    secure: isProduction,
    sameSite: cookieSameSite,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;
  const displayName = (name || username || "").trim();

  if (!displayName) {
    throw new ExpressError(400, "Please provide your name");
  }

  if (!email || !password) {
    throw new ExpressError(400, "Please provide email and password");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ExpressError(400, "User already exists with this email");
  }

  let avatar = {
    public_id: "default_id",
    url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  };

  if (req.file) {
    avatar = {
      public_id: req.file.filename || req.file.public_id || `avatar_${Date.now()}`,
      url: req.file.path || req.file.secure_url,
    };
  }

  const user = await User.create({
    name: displayName,
    email: normalizedEmail,
    password,
    avatar,
  });

  sendTokenResponse(user, 201, res);
});


// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new ExpressError(400, "Please provide a valid email and password");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ExpressError(401, "Invalid email or password");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ExpressError(401, "Invalid email or password");
  }

  // Exclude password from response
  sendTokenResponse(user, 200, res);
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: isProduction,
    sameSite: cookieSameSite,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

//  Request Reset Link
export const forgotPassword = asyncHandler(async (req, res) => {
  const rawEmail = req.body?.email;
  if (!rawEmail || typeof rawEmail !== "string") {
    throw new ExpressError(400, "Please provide a valid email address");
  }

  const email = rawEmail.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    throw new ExpressError(404, "User not found with this email");
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const frontendBase = (
    process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`
  ).replace(/\/$/, "");
  const resetUrl = `${frontendBase}/user/password/reset/${resetToken}`;

  // Preparing for sending email
  const message = `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ExpressError(500, "Email could not be sent");
  }
});

//  Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  // console.log("Password Reset Request", req.params.token, req.body.password);
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError(400, "Invalid or expired token");
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ExpressError(400, "Password does not match!!");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
    user,
  });
});

//Update Existing password
export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  const { oldPassword, newPassword , confirmNewPassword} = req.body;

  // Check if old password is correct
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ExpressError(401, "Old password is incorrect");
  }

  if (newPassword !== confirmNewPassword) {  
    throw new ExpressError(400, "New password does not match");
  } 

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

  

// Get User Profile
export const getUserProfile = asyncHandler(async (req, res) => {  
  // console.log(req.user._id);
  const user = await User.findById(req.user._id).select("-password");      

  if (!user) {
    throw new ExpressError(404, "User not found");
  }   
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Profile
// This function allows users to update their profile information such as name and email.
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ExpressError(404, "User not found");

  // Handle email change
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ExpressError(400, "Email already in use");
    user.email = email;
  }

  if (name) user.name = name;

  // If avatar is uploaded
  if (req.file) {
    // Remove old avatar from cloudinary
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    user.avatar = {
      public_id: req.file.filename,
      url: req.file.path,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    user,
  });
});



// Admin  - Getting user details 
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users: users || [],
  });
});

// Admin -  Getting Single user details
export const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    user,
  });
}); 


// Admin - Changing user role

export const changeUserRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    throw new ExpressError(400, "User ID and role are required");
  }

  if (req.user.role !== "superadmin") {
    throw new ExpressError(403, "Only superadmins can change user roles");
  }

  if (req.user._id.toString() === userId) {
    throw new ExpressError(403, "You cannot change your own role");
  }

  // Prevent changing the role of the last superadmin
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new ExpressError(404, "User not found");
  }

  if (targetUser.role === "superadmin") {
    const superadminCount = await User.countDocuments({ role: "superadmin" });
    if (superadminCount <= 1) {
      throw new ExpressError(
        400,
        "Cannot change the role of the last remaining superadmin"
      );
    }
  }

  targetUser.role = role;
  await targetUser.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user: targetUser,
  });
});


// Admin - Deleting user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  //  Prevent deleting self
  if (req.user._id.toString() === user._id.toString()) {
    throw new ExpressError(403, "You cannot delete your own account");
  }

  //  Admin restrictions
  if (req.user.role === "admin") {
    // admin cannot delete superadmin
    if (user.role === "superadmin") {
      throw new ExpressError(403, "Admins cannot delete a superadmin");
    }
    // admin cannot delete other admins
    if (user.role === "admin") {
      throw new ExpressError(403, "Admins cannot delete other admins");
    }
  }

  // Superadmin restrictions
  if (req.user.role === "superadmin") {
    // Prevent deleting last superadmin
    if (user.role === "superadmin") {
      const superadminCount = await User.countDocuments({ role: "superadmin" });
      if (superadminCount <= 1) {
        throw new ExpressError(400, "Cannot delete the last superadmin");
      }
    }
  }

  //  Prevent deleting last admin (optional rule)
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new ExpressError(400, "Cannot delete the last admin user");
    }
  }

  // Delete avatar from Cloudinary if exists
  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  // Delete user from DB
  await User.deleteOne({ _id: user._id });

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});


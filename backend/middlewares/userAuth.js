import asyncHandler from "../custom/asyncHandler.js";
import jwt from "jsonwebtoken";
import ExpressError from "../custom/ExpressError.js";
import User from "../models/user.model.js";

export const verifyUserAuth = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new ExpressError(
      401,
      "Authorization failed! Please login to access this resource"
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ExpressError(401, "User not found");
  }

  req.user = user;
  next();
});

export const verifyAdminAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ExpressError(401, "Not authorized. Please log in.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ExpressError(401, "User not found");
  }

  // ✅ Allow both admin & superadmin
  if (user.role !== "admin" && user.role !== "superadmin") {
    throw new ExpressError(403, "Access denied! Admins only");
  }

  req.user = user;
  next();
});

import mongoose from "mongoose";
import validator from "validator";
const bcrypt = await import("bcryptjs");
import jwt from "jsonwebtoken"
import crypto from "crypto";


// User schema definition for MongoDB using Mongoose
// This schema defines the structure of user documents in the database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxlength: [25, "Name cannot exceed 25 characters"],
      minlength: [3, "Name should be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password should be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  // Compare the entered password with the hashed password 
  return await bcrypt.compare(enteredPassword, this.password);
}; 

// This method generates a JWT token for the user
userSchema.methods.generateToken = function () {
  // console.log("Token Generated");
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to generate reset token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  
  // Create a hash of the reset token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;

import express from 'express';
const router = express.Router();
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  deleteUser,
  changeUserRole,
} from "../controllers/user.controller.js";
import { getUserProfile } from "../controllers/user.controller.js";
import { verifyAdminAuth, verifyUserAuth } from "../middlewares/userAuth.js";
import {uploadAvatar} from "../middlewares/multer.js"


router.route("/user/register").post(  uploadAvatar.single("avatar"), registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").post(logoutUser);

router.route("/user/password/forgot").post(forgotPassword);
router.route("/user/password/reset/:token").put(resetPassword);
router.route("/user/password/update").put(verifyUserAuth, updatePassword);

// getting user profile 
router.route("/user/profile").get(verifyUserAuth, getUserProfile);
//updating user profile
router
  .route("/user/profile/update")
  .put(  uploadAvatar.single("avatar"), verifyUserAuth, updateUserProfile);

// getting admin all users 
router.route("/admin/users").get(verifyUserAuth, verifyAdminAuth, getAllUsers);
router
  .route("/admin/user/change-role")
  .put(verifyUserAuth, verifyAdminAuth, changeUserRole);
// getting admin user profile
router
  .route("/admin/user/:id")
  .get(verifyUserAuth, verifyAdminAuth, getSingleUser)
  .delete(verifyUserAuth, verifyAdminAuth, deleteUser);


export default router
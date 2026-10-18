import express from "express";
import {
  allMyOrders,
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  trackOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyUserAuth, verifyAdminAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Create new order
router.route("/new/order").post(verifyUserAuth, createOrder);

// User routes
router.route("/user/orders/").get(verifyUserAuth, allMyOrders);
router.route("/user/order/:id").get(verifyUserAuth, getSingleOrder);
router.route("/order/:id/cancel").put(verifyUserAuth, cancelOrder);
router.route("/order/:id/track").get(verifyUserAuth, trackOrder);

// Admin routes
router
  .route("/admin/order/:id")
  .get(verifyUserAuth, verifyAdminAuth, getSingleOrder)
  .put(verifyUserAuth, verifyAdminAuth, updateOrderStatus)
  .delete(verifyUserAuth, verifyAdminAuth, deleteOrder);

router
  .route("/admin/orders/")
  .get(verifyUserAuth, verifyAdminAuth, getAllOrders);

export default router;

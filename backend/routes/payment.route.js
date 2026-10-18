

import express from "express";
import { createOrder, sendAPIKey, verifyPayment } from "../controllers/payment.controller.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/order", verifyUserAuth, createOrder);
router.get("/getKey",verifyUserAuth, sendAPIKey);
router.post("/verify", verifyPayment);

export default router;

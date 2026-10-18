import razorpayInstance from "../custom/razorpay.js";
import crypto from "crypto";
import asyncHandler from "../custom/asyncHandler.js";
import ExpressError from "../custom/ExpressError.js";

// Create Razorpay Order
export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      throw new ExpressError(400, "Please provide a valid payment amount");
    }

    const options = {
      amount: Math.round(numericAmount * 100), // Amount in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err.message || err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Error creating payment order",
    });
  }
});

// Send API Key
export const sendAPIKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// Verify Payment
export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new ExpressError(400, "Incomplete payment verification payload");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        reference: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature",
      });
    }
  } catch (err) {
    console.error("Payment verification error:", err.message || err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Payment verification failed",
    });
  }
});

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../custom/asyncHandler.js";
import ExpressError from "../custom/ExpressError.js";

// ======================= CREATE ORDER =======================
export const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
  } = req.body;

  if (
    !shippingInfo ||
    !orderItems ||
    !Array.isArray(orderItems) ||
    orderItems.length === 0 ||
    !paymentInfo
  ) {
    throw new ExpressError(400, "All order fields and items are required");
  }

  // Verify products, stock availability, and calculate verified server prices
  let verifiedItemsPrice = 0;
  const verifiedOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ExpressError(404, `Product not found: ${item.product}`);
    }

    const requestedQty = Number(item.quantity) || 1;
    if (requestedQty <= 0) {
      throw new ExpressError(400, `Invalid quantity for product "${product.name}"`);
    }

    if (product.stock < requestedQty) {
      throw new ExpressError(
        400,
        `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${requestedQty}`
      );
    }

    const discount = Number(product.discount || 0);
    const unitPrice =
      discount > 0 && discount < 100
        ? Math.round(product.price * (1 - discount / 100))
        : product.price;

    verifiedItemsPrice += unitPrice * requestedQty;

    verifiedOrderItems.push({
      name: product.name,
      price: unitPrice,
      quantity: requestedQty,
      image: item.image || product.images?.[0]?.url || "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      product: product._id,
    });
  }

  // Server-calculated pricing to prevent price tampering
  const verifiedTaxPrice = Math.round(verifiedItemsPrice * 0.18 * 100) / 100;
  const verifiedShippingPrice = verifiedItemsPrice > 1000 ? 0 : 50;
  const verifiedTotalPrice = Math.ceil(verifiedItemsPrice + verifiedShippingPrice + verifiedTaxPrice);

  // Reserve/deduct stock upon confirmed order creation
  for (const item of verifiedOrderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    shippingInfo,
    orderItems: verifiedOrderItems,
    paymentInfo,
    itemsPrice: verifiedItemsPrice,
    taxPrice: verifiedTaxPrice,
    shippingPrice: verifiedShippingPrice,
    totalPrice: verifiedTotalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

// ======================= GET SINGLE ORDER =======================
export const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    throw new ExpressError(404, `Order not found`);
  }

  // Security Check: Only the order owner or admin/superadmin can access
  const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

  if (!isOwner && !isAdmin) {
    throw new ExpressError(403, "You are not authorized to view this order");
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// ======================= GET LOGGED-IN USER'S ORDERS =======================
export const allMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// ======================= ADMIN: GET ALL ORDERS =======================
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// ======================= ADMIN: UPDATE ORDER STATUS =======================
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) throw new ExpressError(404, "Order not found");

  if (order.orderStatus === "Delivered") {
    throw new ExpressError(400, "Order is already delivered, cannot update");
  }
  if (order.orderStatus === "Cancelled") {
    throw new ExpressError(400, "Order is already cancelled, cannot update");
  }

  if (status === "Shipped") {
    if (order.orderStatus !== "Processing") {
      throw new ExpressError(400, "Order must be in Processing state to ship");
    }
    order.orderStatus = "Shipped";
    order.shippedAt = Date.now();
  } else if (status === "Delivered") {
    if (order.orderStatus !== "Shipped") {
      throw new ExpressError(400, "Order must be shipped before delivery");
    }
    order.orderStatus = "Delivered";
    order.deliveredAt = Date.now();
  } else if (status === "Processing") {
    order.orderStatus = "Processing";
  } else if (status === "Cancelled") {
    if (["Shipped", "Delivered"].includes(order.orderStatus)) {
      throw new ExpressError(
        400,
        "Cannot cancel an order that is already shipped or delivered"
      );
    }
    order.orderStatus = "Cancelled";
    order.cancelledAt = Date.now();

    // Restore stock when cancelled by admin
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  } else {
    throw new ExpressError(400, "Invalid status update");
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${order.orderStatus}`,
    order,
  });
});

// ======================= CANCEL ORDER (User) =======================
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) throw new ExpressError(404, "Order not found");

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ExpressError(403, "You are not authorized to cancel this order");
  }

  if (order.orderStatus !== "Processing") {
    throw new ExpressError(
      400,
      "Only orders that are still processing can be cancelled"
    );
  }

  order.orderStatus = "Cancelled";
  order.cancelledAt = Date.now();

  // Restore inventory stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

// ======================= TRACK ORDER (User) =======================
export const trackOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user", "name email");
  if (!order) throw new ExpressError(404, "Order not found");

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    throw new ExpressError(403, "You are not authorized to track this order");
  }

  res.status(200).json({
    success: true,
    status: order.orderStatus,
    deliveredAt: order.deliveredAt,
    shippedAt: order.shippedAt || null,
    placedAt: order.createdAt,
  });
});

// ======================= DELETE ORDER (Admin) =======================
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) throw new ExpressError(404, "Order not found");

  if (order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled") {
    throw new ExpressError(
      400,
      "Only delivered or cancelled orders can be deleted"
    );
  }

  await Order.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

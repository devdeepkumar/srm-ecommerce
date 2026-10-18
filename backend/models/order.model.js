import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      landMark:{
        type:String,
        required:false
      },
      houseNo:{
        type:String
      }
    },

    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentInfo: {
      id: String, // Payment gateway transaction ID
      status: String,
    },

    paidAt: Date,

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },

    deliveredAt: Date,

    cancelledAt: Date, // when order was cancelled

    trackingNumber: {
      type: String, // Optional courier tracking number
    },
    courier: {
      type: String, // e.g., "FedEx", "DHL"
    },
    estimatedDelivery: {
      type: Date, // Optional estimated delivery date
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

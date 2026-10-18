import React from "react";

const OrderDetailsModal = ({ order, onClose, onStatusChange, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Order Details - #{order._id.slice(-8)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Order Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Order ID:</span> #
                {order._id.slice(-8)}
              </p>
              <p>
                <span className="font-medium">Order Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <select
                  className="border rounded-md p-1 text-sm"
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  disabled={isLoading}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {isLoading && (
                  <span className="ml-2 text-xs text-gray-500">
                    Updating...
                  </span>
                )}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> ₹
                {order.totalPrice}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.user?.name || "Guest"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.user?.email || "Not available"}
              </p>
              <p>
                <span className="font-medium">Shipping Address:</span>{" "}
                {[
                  order.shippingInfo?.houseNo,
                  order.shippingInfo?.address,
                  order.shippingInfo?.landMark || order.shippingInfo?.landmark,
                  order.shippingInfo?.city,
                  order.shippingInfo?.state,
                  order.shippingInfo?.country,
                  order.shippingInfo?.postalCode,
                  order.shippingInfo?.phoneNo,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={item.image || "/placeholder-product.jpg"}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {item.product}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">₹{item.price}</td>
                    <td className="px-4 py-3">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

import React, { useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Service = () => {
  const [activeTab, setActiveTab] = useState("shipping");
  const [openFaq, setOpenFaq] = useState(null);

  const tabs = [
    { id: "shipping", label: "Shipping Policy" },
    { id: "returns", label: "Returns & Exchanges" },
    { id: "quality", label: "Quality Guarantee" },
    { id: "faq", label: "Help & FAQ" },
  ];

  const faqs = [
    {
      q: "How long does standard delivery take?",
      a: "Orders are processed within 24-48 hours. Standard domestic delivery typically takes 3-5 business days depending on your location.",
    },
    {
      q: "What is your return and exchange window?",
      a: "We offer a 7-day hassle-free return and exchange policy from the date of delivery for unworn items with original tags intact.",
    },
    {
      q: "How can I track my shipment?",
      a: "Once your order is dispatched, you will receive a tracking link via SMS/Email. You can also view real-time tracking in your 'My Orders' section.",
    },
    {
      q: "Are online payments secure on your website?",
      a: "Yes, all online transactions are processed through RBI-approved, 256-bit SSL encrypted payment gateways (Razorpay, Stripe) ensuring 100% banking-grade security.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl min-h-[75vh]">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Customer Care & Policies
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Everything you need to know about delivery, returns, and our customer support commitment.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Cards */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10">
        {activeTab === "shipping" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-lg pb-3 border-b border-gray-100">
              <LocalShippingOutlinedIcon className="text-amber-600" />
              <span>Domestic & Express Shipping</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We offer free express delivery across all serviceable pin codes in India on orders above ₹999. Orders below ₹999 incur a nominal standard shipping fee of ₹50.
            </p>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Metro cities: Delivery within 2-4 business days.</li>
              <li>Rest of India: Delivery within 4-7 business days.</li>
              <li>Same-day dispatch for orders placed before 1:00 PM IST on working days.</li>
            </ul>
          </div>
        )}

        {activeTab === "returns" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-lg pb-3 border-b border-gray-100">
              <ReplayOutlinedIcon className="text-emerald-600" />
              <span>7-Day Return & Exchange Guarantee</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your satisfaction is our priority. If an item doesn't fit or meet your expectations, initiate a return or exchange within 7 days of delivery directly from your account.
            </p>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Items must be unused, unwashed, and in original packaging with intact price tags.</li>
              <li>Reverse pickup is arranged at no extra cost from your doorstep.</li>
              <li>Refunds are initiated within 48 hours of inspection back to your original payment method.</li>
            </ul>
          </div>
        )}

        {activeTab === "quality" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-lg pb-3 border-b border-gray-100">
              <ShieldOutlinedIcon className="text-indigo-600" />
              <span>100% Authentic Quality Guarantee</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every piece in our catalog undergoes rigorous quality inspection before dispatch to ensure authentic craftsmanship, premium stitching, and true-to-size fit.
            </p>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-900 font-bold text-lg pb-3 border-b border-gray-100">
              <SupportAgentOutlinedIcon className="text-amber-600" />
              <span>Frequently Asked Questions</span>
            </div>
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                >
                  <span>{faq.q}</span>
                  <ExpandMoreIcon
                    className={`transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-gray-500 bg-gray-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Service;

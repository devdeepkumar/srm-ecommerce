import React, { useState } from "react";
import { toast } from "react-toastify";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Thank you! Your inquiry has been sent to our support team.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl min-h-[75vh]">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
          We’re here to help! Reach out for styling advice, order inquiries, or custom fittings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <PhoneOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Call Support</h3>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">+91 98765 43210</p>
              <p className="text-[11px] text-gray-400">Mon - Sat, 10am to 7pm IST</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <EmailOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Inquiry</h3>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">support@srmvastralaya.com</p>
              <p className="text-[11px] text-gray-400">Responses within 24 hours</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Store Flagship</h3>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">Shree RamJanki Vastralaya</p>
              <p className="text-[11px] text-gray-400">Main Market Road, Bihar, India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Order question, custom sizing, feedback..."
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you today?"
                required
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

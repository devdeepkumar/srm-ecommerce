import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Shree RamJanki Vastralaya updates!");
    setEmail("");
  };

  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-gray-800/80">
          {/* Col 1: Brand & Contact Overview */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-1">
                Authentic Ethnic Store
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Shree RamJanki Vastralaya
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Your trusted e-commerce platform offering quality ethnic wear, festive collections, sarees, and modern fashion with fast pan-India delivery.
            </p>

            <div className="space-y-2 pt-1 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <PhoneOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-500" />
                <span>+91 98765 43210 (10 AM - 7 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <EmailOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-500" />
                <span>support@srmvastralaya.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition duration-200"
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition duration-200"
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition duration-200"
              >
                <TwitterIcon sx={{ fontSize: 18 }} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition duration-200"
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <StorefrontOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-500" />
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <LocationOnOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <PaymentOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Shop / Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <SupportAgentOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <SecurityOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Services & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <SecurityOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-500" />
              Customer Service
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <AssignmentReturnOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <PolicyOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/sitemap"
                  className="text-gray-400 hover:text-amber-400 transition flex items-center gap-2"
                >
                  <StorefrontOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Payment Confidence */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe for updates, festive promotions, and exclusive member discounts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-900 border border-gray-800 focus:border-amber-500 text-white placeholder-gray-500 text-xs rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg flex items-center justify-center transition cursor-pointer"
                >
                  <SendOutlinedIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </form>

            <div className="pt-2">
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase block mb-2">
                100% Secure Payments
              </span>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded-md text-[10px] font-bold text-gray-300">
                  UPI
                </div>
                <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded-md text-[10px] font-bold text-gray-300">
                  RuPay
                </div>
                <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded-md text-[10px] font-bold text-gray-300">
                  Razorpay
                </div>
                <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded-md text-[10px] font-bold text-gray-300">
                  Stripe
                </div>
                <CreditCardOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Shree RamJanki Vastralaya. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-amber-400 transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-amber-400 transition"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-amber-400 transition"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

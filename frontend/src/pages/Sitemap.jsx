import { Link } from "react-router-dom";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Sitemap = () => {
  const sections = [
    {
      title: "Store & Catalog",
      icon: <StorefrontOutlinedIcon className="text-amber-600" />,
      links: [
        { label: "Home Page", path: "/" },
        { label: "All Products (Catalog)", path: "/products" },
        { label: "Shopping Bag / Cart", path: "/cart" },
      ],
    },
    {
      title: "Customer Policies",
      icon: <PolicyOutlinedIcon className="text-emerald-600" />,
      links: [
        { label: "Shipping & Delivery Policy", path: "/shipping-policy" },
        { label: "Return & Exchange Policy", path: "/return-policy" },
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Terms & Conditions", path: "/terms-and-conditions" },
        { label: "Customer Care Hub", path: "/services" },
      ],
    },
    {
      title: "My Account & Orders",
      icon: <PersonOutlineOutlinedIcon className="text-indigo-600" />,
      links: [
        { label: "User Login", path: "/user/login" },
        { label: "Create Account", path: "/user/register" },
        { label: "User Profile", path: "/user/profile" },
        { label: "My Orders", path: "/user/orders" },
        { label: "Forgot Password", path: "/user/password/forgot" },
      ],
    },
    {
      title: "Company & Support",
      icon: <InfoOutlinedIcon className="text-blue-600" />,
      links: [
        { label: "About Our Heritage", path: "/about" },
        { label: "Contact Us & Store Location", path: "/contact" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl min-h-[75vh]">
      {/* Back to Home Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 mb-3 shadow-xs">
          <AltRouteOutlinedIcon sx={{ fontSize: 28 }} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          Website Sitemap
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Explore all public pages, shopping categories, policy documents, and account management links.
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
              <div className="p-2.5 rounded-xl bg-gray-50">
                {section.icon}
              </div>
              <h2 className="text-base font-bold text-gray-900">
                {section.title}
              </h2>
            </div>
            <ul className="space-y-2.5">
              {section.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link
                    to={link.path}
                    className="group flex items-center justify-between text-xs sm:text-sm text-gray-600 hover:text-amber-600 transition font-medium"
                  >
                    <span>{link.label}</span>
                    <span className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sitemap;

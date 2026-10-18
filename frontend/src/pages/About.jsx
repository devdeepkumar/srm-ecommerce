import React from "react";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl min-h-[75vh]">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          About Our Heritage
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
          Crafting memorable fashion and delivering timeless Indian apparel with uncompromising quality.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10 mb-10 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Our Story & Philosophy
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Founded with a passion for exquisite Indian weaves and modern wardrobe essentials, Shree RamJanki Vastralaya brings together the finest textiles, master artisan craftsmanship, and seamless contemporary shopping.
        </p>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          From celebratory wedding couture to everyday comfort, our collections are meticulously curated to ensure every piece embodies grace, durable comfort, and genuine value.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <VerifiedOutlinedIcon sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Authentic Sourcing</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              We work directly with certified artisan clusters across India to deliver 100% genuine fabrics.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <GroupsOutlinedIcon sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Customer First</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Over 50,000 satisfied shoppers with dedicated concierge and after-sales support.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <LocalShippingOutlinedIcon sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Pan-India Express</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Doorstep courier across 25,000+ pin codes with live dispatch updates.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <FavoriteBorderIcon sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Ethical Craft</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Fair compensation for handloom artisans and eco-conscious packaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

import quality_icon from "../assets/quality_icon.png";
import exchange_icon from "../assets/exchange_icon.png";
import support_img from "../assets/support_img.png";

export default function OurPolicy() {
  const policies = [
    {
      img: exchange_icon,
      title: "Easy Exchange Policy",
      desc: "Fast and hassle-free exchange at your doorstep",
    },
    {
      img: quality_icon,
      title: "7 Days Return Guarantee",
      desc: "Hassle-free 7 days free returns with full refund",
    },
    {
      img: support_img,
      title: "24/7 Customer Assistance",
      desc: "Dedicated support team available anytime",
    },
  ];

  return (
    <section className="py-14 sm:py-16 my-8 border-y border-gray-100" aria-label="Store Policies">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {policies.map((p, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
              <img src={p.img} className="w-8 h-8 object-contain" alt={p.title} />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
              {p.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

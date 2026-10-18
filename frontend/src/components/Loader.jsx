// src/components/Loader.jsx
const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-3 border-gray-100"></div>
        <div className="absolute inset-0 rounded-full border-3 border-amber-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-gray-500 animate-pulse">
        Loading
      </p>
    </div>
  );
};

export default Loader;

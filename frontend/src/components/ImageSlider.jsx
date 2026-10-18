import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ImageSlider = () => {
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "Exclusive Collection",
      description: "Explore our latest arrivals and enjoy exclusive seasonal offers.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&auto=format&fit=crop&q=80",
      ctaText: "Shop Now",
    },
    {
      id: 4,
      title: "Summer Collection",
      description: "Discover our new breezy summer arrivals with up to 30% off.",
      image:
        "https://images.unsplash.com/photo-1612731486606-2614b4d74921?w=1400&auto=format&fit=crop&q=80",
      ctaText: "Shop Now",
    },
    {
      id: 2,
      title: "Winter Essentials",
      description: "Stay stylish and warm with our premium winter apparel.",
      image:
        "https://plus.unsplash.com/premium_photo-1708110920881-635419c3411f?w=1400&auto=format&fit=crop&q=80",
      ctaText: "Explore Now",
    },
    {
      id: 3,
      title: "Limited Edition",
      description: "Exclusive signature designs available for a limited time.",
      image:
        "https://images.unsplash.com/photo-1538329972958-465d6d2144ed?w=1400&auto=format&fit=crop&q=80",
      ctaText: "View Collection",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden group bg-gray-900">
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* High-legibility gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
              <div className="container flex justify-center items-center mx-auto px-6 sm:px-12 md:px-16">
                <div className="max-w-xl text-center text-white space-y-3 sm:space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Featured Collection
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed font-light">
                    {slide.description}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => navigate("/products")}
                      className="inline-flex items-center gap-2 bg-white hover:bg-amber-500 hover:text-white text-gray-900 px-6 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon sx={{ fontSize: 24 }} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRightIcon sx={{ fontSize: 24 }} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 cursor-pointer rounded-full ${
              currentIndex === index
                ? "w-7 h-2 bg-amber-400"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;

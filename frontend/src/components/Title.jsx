import React from "react";

export default function Title({ text1, text2 }) {
  return (
    <div className="inline-flex items-center gap-3 mb-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl tracking-wider uppercase font-semibold text-gray-900">
        <span className="text-gray-400 font-normal">{text1}</span>{" "}
        <span className="text-gray-900 font-bold">{text2}</span>
      </h2>
      <span className="w-10 sm:w-14 h-[2px] bg-gray-900 rounded-full"></span>
    </div>
  );
}

import React from "react";

const SkeletonCard = () => {
  return (
    <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] w-full bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-3.5 sm:p-4 space-y-2.5">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

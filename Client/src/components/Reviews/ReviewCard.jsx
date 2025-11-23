import React from "react";
import { FaStar } from "react-icons/fa";

/**
 * Props:
 *  - userName (string)
 *  - rating (number)
 *  - comment (string)
 *  - createdAt (ISO string)
 */
export default function ReviewCard({ userName, rating, comment, createdAt }) {
  const date = createdAt ? new Date(createdAt) : null;
  const niceDate = date ? date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) : "";

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-[#d4bf92]" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4bf92] to-[#c6ae7b] flex items-center justify-center text-white font-bold text-lg shadow-md">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">{userName || "Anonymous User"}</div>
            <div className="text-xs text-gray-500 mt-0.5">{niceDate}</div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1">
          {renderStars()}
        </div>

      </div>

      {/* Comment */}
      <div className="text-gray-700 leading-relaxed">
        {comment || <span className="text-gray-400 italic">No comment provided</span>}
      </div>
    </div>
  );
}

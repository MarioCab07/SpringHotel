import React from "react";

/**
 * Props:
 *  - userName (string)
 *  - rating (number)
 *  - comment (string)
 *  - createdAt (ISO string)
 */
export default function ReviewCard({ userName, rating, comment, createdAt }) {
  const date = createdAt ? new Date(createdAt) : null;
  const niceDate = date ? date.toLocaleString() : "";

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{userName || `Usuario ${""}`}</div>
            <div className="text-xs text-gray-400">{niceDate}</div>
          </div>
        </div>

        <div className="text-yellow-500 text-sm font-semibold">
          {Array.from({ length: Math.max(0, Math.min(5, rating || 0)) }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>

      <div className="mt-3 text-gray-700 text-sm leading-relaxed">
        {comment || <span className="text-gray-400 italic">Sin comentario</span>}
      </div>
    </div>
  );
}

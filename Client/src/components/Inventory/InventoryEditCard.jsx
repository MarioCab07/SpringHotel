import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ToggleSwitch from "../Buttons/ToggleSwitch";

const InventoryEditCard = ({ category, products, onEdit, onItemEdit, isFirst, isLast }) => {
  const [enabled, setEnabled] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <div className={`
      bg-white flex flex-col
      border border-gray-200
      ${isFirst ? "rounded-t-xl" : ""}
      ${isLast ? "rounded-b-xl" : "border-b-0"}
    `}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg text-gray-900">{category}</span>
          <button
            onClick={onEdit}
            className="text-[#D9C696] hover:text-[#c5b386] text-sm font-medium transition-colors"
          >
            Edit Section
          </button>
        </div>

        <div className="flex items-center gap-4">
          <ToggleSwitch enabled={enabled} onToggle={handleToggle} />
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            {expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <div className="px-6 py-4 text-gray-400 italic text-center">
              No hay productos en esta categoría
            </div>
          ) : (
            products.map((p) => {
              const availability =
                p.quantity <= 5 ? "Out of Stock" :
                p.quantity <= 25 ? "Low" : "Sufficient";

              const availabilityColor =
                availability === "Out of Stock" ? "text-red-600" :
                availability === "Low" ? "text-yellow-600" :
                "text-green-600";

              return (
                <div
                  key={p.id}
                  className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onItemEdit?.(p)}
                >
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-600">{p.quantity} uds</span>
                    <span className={`text-sm font-medium ${availabilityColor}`}>{availability}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryEditCard;

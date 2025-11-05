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
      border border-gray-300
      ${isFirst ? "rounded-t-md" : ""}
      ${isLast ? "rounded-b-md border-b" : "border-b-0"}
    `}>
      <div className="flex items-center justify-between px-4 py-3">
  <div className="flex items-center gap-3">
    <span className="font-semibold text-lg">{category}</span>
    <button
      onClick={onEdit}
      className="text-pink-500 hover:underline text-sm"
    >
      Edit Section
    </button>
  </div>

  <div className="flex items-center gap-4">
    <ToggleSwitch enabled={enabled} onToggle={handleToggle} />
    <button onClick={() => setExpanded(!expanded)} className="text-gray-600">
      {expanded ? <FaChevronUp /> : <FaChevronDown />}
    </button>
  </div>
</div>

      {expanded && (
  <div className="divide-y border-t mt-2">
{products.length === 0 ? (
  <div className="px-4 py-3 text-gray-400 italic">
    No hay productos en esta categoría.
  </div>
) : (
  products.map((p) => {
    const availability =
      p.quantity <= 5 ? "Out of Stock" :
      p.quantity <= 25 ? "Low" : "Sufficient";

    const availabilityColor =
      availability === "Out of Stock" ? "text-red-500" :
      availability === "Low" ? "text-yellow-500" :
      "text-green-500";

    return (
      <div
        key={p.id}
        className="flex justify-between items-center px-4 py-3 hover:bg-blue-50 cursor-pointer"
        onClick={() => onItemEdit?.(p)}
      >
        <div className="text-lg">{p.name}</div>
        <div className="flex items-center gap-6 text-lg">
          <span>{p.quantity}</span>
          <span className={`${availabilityColor}`}>{availability}</span>
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

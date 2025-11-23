import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ToggleSwitch from "../Buttons/ToggleSwitch";
import StockIndicator from "./StockIndicator";

const InventoryEditCard = ({ category, products, onEdit, onItemEdit, onUpdateQuantity, isFirst, isLast }) => {
  const [enabled, setEnabled] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleToggle = () => {
    setEnabled((prev) => !prev);
  };

  const handleQuantityClick = (e, product) => {
    e.stopPropagation(); // Evitar que se active el onClick del item
    setEditingId(product.id);
    setEditValue(product.quantity?.toString() || "0");
  };

  const handleQuantityBlur = async (e, product) => {
    e.stopPropagation();
    if (editingId === product.id) {
      const newQuantity = parseInt(editValue) || 0;
      if (newQuantity !== product.quantity && onUpdateQuantity) {
        await onUpdateQuantity(product.id, newQuantity);
      }
      setEditingId(null);
      setEditValue("");
    }
  };

  const handleQuantityKeyDown = async (e, product) => {
    if (e.key === "Enter") {
      e.target.blur();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditValue("");
    }
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
              const isLowStock = p.isLowStock || (p.minimumStock > 0 && p.quantity < p.minimumStock);
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
                  className={`flex justify-between items-center px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isLowStock ? "bg-red-50/50 border-l-4 border-red-400" : ""
                  }`}
                  onClick={() => onItemEdit?.(p)}
                >
                  <div className="flex items-center gap-2">
                    {isLowStock && (
                      <span className="text-red-500 text-xs" title="Stock bajo">
                        ⚠️
                      </span>
                    )}
                    <div className="font-medium text-gray-900">{p.name}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    {editingId === p.id ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={editValue}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setEditValue(val);
                        }}
                        onBlur={(e) => handleQuantityBlur(e, p)}
                        onKeyDown={(e) => handleQuantityKeyDown(e, p)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 text-sm font-medium text-gray-900 text-center border-2 border-[#D9C696] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D9C696] transition"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityClick(e, p);
                        }}
                        className="cursor-pointer"
                        title="Click para editar cantidad"
                      >
                        <StockIndicator 
                          quantity={p.quantity ?? 0} 
                          minimumStock={p.minimumStock ?? 0}
                          showMinimum={p.minimumStock > 0}
                        />
                      </div>
                    )}
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

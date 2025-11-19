import { useState } from "react";

const InventoryTable = ({ category, products, onToggleAvailability, onUpdateQuantity, allowEdit = false }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleQuantityClick = (product) => {
    if (!allowEdit) return;
    setEditingId(product.id);
    setEditValue(product.quantity?.toString() || "0");
  };

  const handleQuantityBlur = async (product) => {
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
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="px-6 py-4 font-semibold text-xl text-gray-900 border-b border-gray-200 bg-gray-50">
        {category}
      </div>
      {products.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          No hay productos en esta categoría
        </div>
      ) : (
        <table className="w-full text-left">
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 w-full">
                  <div className="font-semibold text-gray-900">{prod.name}</div>
                  {prod.description && (
                    <div className="text-sm text-gray-600 mt-1">{prod.description}</div>
                  )}
                  {prod.type && (
                    <div className="text-xs text-gray-500 italic mt-1">{prod.type}</div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 justify-end">
                    {editingId === prod.id ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={editValue}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setEditValue(val);
                        }}
                        onBlur={() => handleQuantityBlur(prod)}
                        onKeyDown={(e) => handleQuantityKeyDown(e, prod)}
                        className="w-20 text-sm font-medium text-gray-900 text-center border-2 border-[#D9C696] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D9C696] transition"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => handleQuantityClick(prod)}
                        className={`text-sm font-medium text-gray-700 whitespace-nowrap ${
                          allowEdit 
                            ? "cursor-pointer hover:text-[#D9C696] hover:underline transition-colors" 
                            : "cursor-default"
                        }`}
                        title={allowEdit ? "Click para editar cantidad" : ""}
                      >
                        {prod.quantity ?? 0} uds
                      </span>
                    )}

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id={`availability-${prod.id}`}
                        name={`availability-${prod.id}`}
                        checked={prod.available}
                        onChange={() => onToggleAvailability(prod.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300" />
                      <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-5" />
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryTable;

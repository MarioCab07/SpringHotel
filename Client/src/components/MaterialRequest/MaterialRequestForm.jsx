import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllInventoryItems,
  getAllCategories,
  createMaterialRequest,
} from "../../service/api.services";

const MaterialRequestForm = ({ onSuccess, onCancel }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        getAllInventoryItems(),
        getAllCategories(),
      ]);

      const items = itemsRes.data.data.filter(
        (item) => item.status === "ACTIVE" && item.quantity > 0
      );
      setInventoryItems(items);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catId) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleQuantityChange = (itemId, quantity) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (!item) return;

    const qty = parseInt(quantity) || 0;

    if (qty < 0) {
      toast.error("La cantidad no puede ser negativa");
      return;
    }

    if (qty > item.quantity) {
      toast.error(
        `No hay suficiente stock. Disponible: ${item.quantity} unidades`
      );
      return;
    }

    if (qty === 0) {
      const newSelected = { ...selectedItems };
      delete newSelected[itemId];
      setSelectedItems(newSelected);
    } else {
      setSelectedItems({ ...selectedItems, [itemId]: qty });
    }
  };

  const handleSubmit = async () => {
    const items = Object.keys(selectedItems)
      .filter((id) => selectedItems[id] > 0)
      .map((id) => ({
        itemId: Number(id),
        requestedQuantity: selectedItems[id],
      }));

    if (items.length === 0) {
      toast.error("Debes seleccionar al menos un artículo");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items,
        notes: notes.trim() || null,
      };

      await createMaterialRequest(payload);
      toast.success("Solicitud de materiales enviada correctamente");

      // Limpiar formulario
      setSelectedItems({});
      setNotes("");

      // Recargar datos para actualizar stock
      await loadData();

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error creating request:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al crear la solicitud";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const categoriesMap = categories.reduce((map, cat) => {
    map[cat.id] = cat;
    return map;
  }, {});

  const itemsByCategory = inventoryItems.reduce((acc, item) => {
    const catId = item.categoryId || "uncategorized";
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Cargando artículos...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Notas (opcional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Agregar notas sobre la solicitud..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9C696] focus:border-transparent text-sm"
          rows={2}
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.keys(itemsByCategory).map((catId) => {
          const category = categoriesMap[catId];
          const items = itemsByCategory[catId];
          const isExpanded = expandedCats[catId];

          return (
            <div
              key={catId}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(catId)}
                className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left"
              >
                <span className="font-semibold text-gray-900 text-sm">
                  {category?.name || "Sin categoría"} ({items.length})
                </span>
                <span className="text-gray-500">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>
              {isExpanded && (
                <div className="p-3 space-y-2 bg-white">
                  {items.map((item) => {
                    const selectedQty = selectedItems[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 rounded border ${
                          selectedQty > 0
                            ? "border-[#D9C696] bg-[#D9C696]/10"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Disponible: {item.quantity} unidades
                          </div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={selectedQty}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-[#D9C696] focus:border-transparent"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Artículos seleccionados:{" "}
          <span className="font-semibold">
            {Object.keys(selectedItems).filter((id) => selectedItems[id] > 0)
              .length}
          </span>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              Object.keys(selectedItems).filter((id) => selectedItems[id] > 0)
                .length === 0
            }
            className="px-4 py-2 bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialRequestForm;


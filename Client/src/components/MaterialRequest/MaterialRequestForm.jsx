import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import {
  getAllInventoryItems,
  getAllCategories,
  createMaterialRequest,
  updateItemQuantityWithLog,
} from "../../service/api.services";

const MaterialRequestForm = forwardRef(({ onSuccess, onCancel, currentUserId, directConsume = false, showNotes = true, showCategories = false, hideSubmitButton = false }, ref) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        getAllInventoryItems(),
        getAllCategories(),
      ]);

      const itemsData = Array.isArray(itemsRes.data) 
        ? itemsRes.data 
        : itemsRes.data?.data || [];
      
      const categoriesData = Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : categoriesRes.data?.data || [];

      const items = itemsData.filter(
        (item) => (item.status === "ACTIVE" || item.status === "active") && item.quantity > 0
      );
      
      setInventoryItems(items);
      setCategories(categoriesData);
      
      // Colapsar todas las categorías por defecto
      const allExpanded = {};
      categoriesData.forEach(cat => {
        if (cat && cat.id) allExpanded[cat.id] = false;
      });
      setExpandedCats(allExpanded);
    } catch (err) {
      console.error("Error loading data:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error desconocido";
      toast.error("Error al cargar los datos: " + errorMsg);
      setError(errorMsg);
      setInventoryItems([]);
      setCategories([]);
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
      if (directConsume && currentUserId) {
        // Modo directo: consumir inventario inmediatamente
        await Promise.all(
          items.map(async (item) => {
            await updateItemQuantityWithLog(item.itemId, item.requestedQuantity, currentUserId, "USE");
          })
        );
        
        toast.success("Inventario ajustado correctamente");
        
        // Recargar inventario para obtener valores actualizados
        await loadData();
      } else {
        // Modo normal: crear solicitud de materiales
        const payload = {
          items,
          notes: notes.trim() || null,
        };

        await createMaterialRequest(payload);
        toast.success("Solicitud de materiales enviada correctamente");
      }

      setSelectedItems({});
      setNotes("");
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        (directConsume ? "Error al ajustar el inventario" : "Error al crear la solicitud");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Exponer función para ser llamada desde fuera
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    getSelectedItems: () => selectedItems,
  }));

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9C696]"></div>
        <p className="mt-4 text-gray-600">Cargando artículos disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2 font-semibold">Error al cargar datos</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 rounded-lg text-sm font-semibold transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (inventoryItems.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <FaShoppingCart className="mx-auto text-gray-400 text-4xl mb-3" />
        <p className="text-gray-600 mb-2 font-medium">No hay artículos disponibles</p>
        <p className="text-sm text-gray-500">Todos los artículos están agotados o inactivos</p>
      </div>
    );
  }

  const categoriesMap = categories.reduce((map, cat) => {
    if (cat && cat.id) {
      map[cat.id] = cat;
    }
    return map;
  }, {});

  const itemsByCategory = inventoryItems.reduce((acc, item) => {
    if (item && item.id) {
      const catId = item.categoryId || "uncategorized";
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(item);
    }
    return acc;
  }, {});

  // Filtrar por búsqueda
  const filteredCategories = Object.keys(itemsByCategory).filter(catId => {
    if (!searchQuery) return true;
    const category = categoriesMap[catId];
    const items = itemsByCategory[catId];
    const categoryMatch = category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const itemsMatch = items.some(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return categoryMatch || itemsMatch;
  });

  const selectedCount = Object.keys(selectedItems).filter((id) => selectedItems[id] > 0).length;
  const totalQuantity = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-5">
      {/* Header con resumen - No mostrar en modo normal */}

      {/* Búsqueda - Solo mostrar si showNotes es true (modo solicitud) */}
      {showNotes && (
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por categoría o artículo..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9C696] focus:border-transparent text-sm"
          />
        </div>
      )}

      {/* Notas - Solo mostrar si showNotes es true */}
      {showNotes && (
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Notas adicionales (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar comentarios o instrucciones especiales..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9C696] focus:border-transparent text-sm resize-none"
            rows={2}
          />
        </div>
      )}

      {/* Lista de artículos por categoría - Solo mostrar si showCategories es true */}
      {showCategories && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No se encontraron artículos con "{searchQuery}"</p>
            </div>
          ) : (
            filteredCategories.map((catId) => {
              const category = categoriesMap[catId];
              const items = itemsByCategory[catId];
              const isExpanded = expandedCats[catId] === true;
              const categorySelectedCount = items.filter(item => selectedItems[item.id] > 0).length;

              return (
                <div
                  key={catId}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                <button
                  onClick={() => toggleCategory(catId)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 flex justify-between items-center text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <FaChevronUp className="text-gray-500 text-sm" />
                    ) : (
                      <FaChevronDown className="text-gray-500 text-sm" />
                    )}
                    <span className="font-semibold text-gray-900">
                      {category?.name || "Sin categoría"}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                      {items.length} artículo{items.length !== 1 ? 's' : ''}
                    </span>
                    {categorySelectedCount > 0 && (
                      <span className="text-xs bg-[#D9C696] text-gray-900 px-2 py-0.5 rounded-full font-medium">
                        {categorySelectedCount} seleccionado{categorySelectedCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-4 bg-white space-y-2">
                    {items.map((item) => {
                      const selectedQty = selectedItems[item.id] || 0;
                      const isSelected = selectedQty > 0;

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-[#D9C696] bg-[#D9C696]/10 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <FaCheckCircle className="text-[#D9C696] flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </div>
                                {item.type && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Tipo: {item.type}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                item.quantity > 10
                                  ? "bg-green-100 text-green-700"
                                  : item.quantity > 5
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                Stock: {item.quantity} unidades
                              </span>
                              {isSelected && (
                                <span className="text-xs text-[#D9C696] font-semibold">
                                  Solicitando: {selectedQty} unidad{selectedQty !== 1 ? 'es' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <label className="text-xs text-gray-600 font-medium">
                              Cantidad:
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={selectedQty || ""}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-sm font-semibold focus:ring-2 focus:ring-[#D9C696] focus:border-[#D9C696] transition-all"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Resumen - Solo mostrar si hideSubmitButton es false */}
      {!hideSubmitButton && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Artículos seleccionados:{" "}
                <span className="font-bold text-gray-900">{selectedCount}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total de unidades:{" "}
                <span className="font-bold text-gray-900">{totalQuantity}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-3 border-t border-gray-200">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                selectedCount === 0
              }
              className={`flex-1 px-4 py-2.5 bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  {directConsume ? "Actualizando..." : "Enviando..."}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaShoppingCart />
                  {directConsume ? "Submit Inventory" : "Enviar Solicitud"}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Resumen compacto cuando hideSubmitButton es true */}
      {hideSubmitButton && (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Artículos seleccionados:{" "}
                <span className="font-bold text-gray-900">{selectedCount}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total de unidades:{" "}
                <span className="font-bold text-gray-900">{totalQuantity}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MaterialRequestForm.displayName = "MaterialRequestForm";

export default MaterialRequestForm;

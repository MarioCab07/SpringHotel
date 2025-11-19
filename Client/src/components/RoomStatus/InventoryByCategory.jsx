const InventoryByCategory = ({
  categories,
  inventoryItems,
  checkedItems,
  itemQuantities,
  onToggleItem,
  onChangeQty,
  expandedCats,
  onToggleCategory
}) => {

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Inventario por Categoría
      </h2>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No hay categorías disponibles</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {categories.map(cat => {
            const itemsInCat = inventoryItems.filter(i => i.categoryId === cat.id);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between cursor-pointer px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => onToggleCategory(cat.id)}
                >
                  <h3 className="font-semibold text-sm text-gray-900">{cat.name}</h3>
                  <button className="text-xs text-gray-600 font-medium px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                    {expandedCats[cat.id] ? "− Ocultar" : "+ Ver"}
                  </button>
                </div>

                {expandedCats[cat.id] && (
                  <div className="px-4 pb-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {itemsInCat.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!checkedItems[item.id]}
                            onChange={() => onToggleItem(item.id)}
                            className="w-4 h-4 text-[#D9C696] border-gray-300 rounded focus:ring-[#D9C696] cursor-pointer"
                          />

                          <label className="flex-1 text-sm text-gray-700 cursor-pointer truncate">
                            {item.name}
                          </label>

                          {checkedItems[item.id] && (
                            <input
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={itemQuantities[item.id] || ""}
                              onChange={e => onChangeQty(item.id, e.target.value)}
                              placeholder="Qty"
                              className="w-16 p-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#D9C696] focus:border-transparent"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryByCategory;
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
   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Inventory by Category</h2>

      {categories.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-3">No hay categorías disponibles</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map(cat => {
            const itemsInCat = inventoryItems.filter(i => i.categoryId === cat.id);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat.id} className="bg-white rounded-lg border border-gray-200 p-2.5">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => onToggleCategory(cat.id)}
                >
                  <h3 className="text-xs font-semibold text-gray-900 truncate">{cat.name}</h3>
                  <button className="text-xs text-[#D9C696] hover:text-[#c5b386] font-medium transition-colors flex-shrink-0 ml-2">
                    {expandedCats[cat.id] ? "−" : "+"}
                  </button>
                </div>

                {expandedCats[cat.id] && (
                  <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {itemsInCat.map(item => (
                      <li key={item.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded transition-colors min-w-0">
                        <input
                          type="checkbox"
                          checked={!!checkedItems[item.id]}
                          onChange={() => onToggleItem(item.id)}
                          className="w-3.5 h-3.5 text-[#D9C696] border-gray-300 rounded focus:ring-[#D9C696] focus:ring-1 cursor-pointer flex-shrink-0"
                        />

                        <label className="flex-1 text-xs text-gray-900 cursor-pointer truncate">{item.name}</label>

                        {checkedItems[item.id] && (
                          <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={itemQuantities[item.id] || ""}
                            onChange={e => onChangeQty(item.id, e.target.value)}
                            placeholder="Qty"
                            className="w-16 p-1 border border-gray-300 rounded text-right text-xs focus:outline-none focus:ring-1 focus:ring-[#D9C696] focus:border-[#D9C696] transition flex-shrink-0"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
)};

export default InventoryByCategory;
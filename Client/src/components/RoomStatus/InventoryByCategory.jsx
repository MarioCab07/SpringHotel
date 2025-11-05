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
   <div className="p-4 bg-gray-100 rounded-lg mb-6 space-y-6">
      <h2 className="font-medium text-lg">Inventory by Category</h2>

      {categories.map(cat => {
        const itemsInCat = inventoryItems.filter(i => i.categoryId === cat.id);
        if (itemsInCat.length === 0) return null;

        return (
          <div key={cat.id} className="bg-white rounded p-4 shadow">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onToggleCategory(cat.id)}
            >
              <h3 className="font-semibold">{cat.name}</h3>
              <button className="text-sm text-gray-500">
                {expandedCats[cat.id] ? "− Ocultar" : "+ Ver"}
              </button>
            </div>

            {expandedCats[cat.id] && (
              <ul className="mt-2 grid grid-cols-3 gap-4">
                {itemsInCat.map(item => (
                  <li key={item.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => onToggleItem(item.id)}
                      className="form-checkbox h-5 w-5 accent-black"
                    />

                    <label className="flex-1">{item.name}</label>

                    {checkedItems[item.id] && (
                      <input
                        type="number"
                        min="0"
                        value={itemQuantities[item.id] || ""}
                        onChange={e => onChangeQty(item.id, e.target.value)}
                        placeholder="Cantidad"
                        className="w-20 p-1 border rounded text-right"
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
)};

export default InventoryByCategory;
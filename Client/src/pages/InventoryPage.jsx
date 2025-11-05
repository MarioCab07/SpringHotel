import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InventoryCategoryCard from "../components/Inventory/InventoryCategoryCard";
import InventoryTable from "../components/Inventory/InventoryTable";
import SearchSortBar from "../components/SearchSortBar";
import EditInventoryButton from "../components/Buttons/EditInventoryButton";
import { getAllInventoryItems,
  updateInventoryItemStatus 
 } from "../service/api.services";

const InventoryPage = () => {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("Sort By");
  const [data, setData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleEditClick = () => {
    console.log("Editar Inventario");
  };

  const handleSearch = (term) => {
  setQuery(term);
};

  const handleSortChange = (option) => {
  setSortOption(option);
};

  const toggleAvailability = async (id) => {
  const updated = data.map((item) =>
    item.id === id
      ? {
          ...item,
          available: !item.available,
          status: item.available ? "INACTIVE" : "ACTIVE",
        }
      : item
  );
  setData(updated);

  try {
    const updatedItem = updated.find((item) => item.id === id);
    await updateInventoryItemStatus(id, updatedItem.status);
  } catch (error) {
    console.error("Error al actualizar estado del producto:", error);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllInventoryItems();
        if (res.status === 200) {
          const items = res.data.data.map((item) => ({
              ...item,
              available: item.status === "ACTIVE",
            }));
          setData(items);
          if (items.length > 0) {
            const firstCatId = items[0].categoryId ?? 0;
            setSelectedCategoryId(firstCatId);
          }
        }
      } catch (err) {
        console.error("Error al obtener inventario:", err);
      }
    };

    fetchData();
  }, []);

  const categoriesMap = {};

  data.forEach((item) => {
    const catId = item.categoryId ?? 0;
    const catName = item.categoryName ?? "Sin categoría";

    if (!categoriesMap[catId]) {
      categoriesMap[catId] = {
        id: catId,
        name: catName,
        count: 0,
        products: [],
      };
    }

    categoriesMap[catId].products.push(item);
    categoriesMap[catId].count++;
  });

  let filteredData =
  selectedCategoryId && categoriesMap[selectedCategoryId]
    ? categoriesMap[selectedCategoryId].products.filter((product) =>
        (product.name?.toLowerCase().includes(query.toLowerCase()) ||
         product.description?.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

// Aplicar ordenamiento
if (sortOption === "Nombre A-Z") {
  filteredData.sort((a, b) => a.name.localeCompare(b.name));
} else if (sortOption === "Nombre Z-A") {
  filteredData.sort((a, b) => b.name.localeCompare(a.name));
} else if (sortOption === "Más cantidad") {
  filteredData.sort((a, b) => b.quantity - a.quantity);
} else if (sortOption === "Menos cantidad") {
  filteredData.sort((a, b) => a.quantity - b.quantity);
}

  return (
      <div className="p-4 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <SearchSortBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              onSortChange={handleSortChange}
              initialSort="Sort By"
            />
          </div>
          <div className="shrink-0">
            <EditInventoryButton onClick={handleEditClick} />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/3 space-y-2">
            {Object.values(categoriesMap).map((cat) => (
              <InventoryCategoryCard
                key={cat.id}
                title={cat.name}
                productCount={cat.products.length}
                unavailableCount={
                  cat.products.filter((p) => !p.available).length
                }
                selected={cat.id === selectedCategoryId}
                onClick={() => setSelectedCategoryId(cat.id)}
              />
            ))}
          </div>

          <div className="w-2/3">
            <InventoryTable
              category={
                categoriesMap[selectedCategoryId]?.name || "Sin categoría"
              }
              products={filteredData}
              onToggleAvailability={toggleAvailability}
            />
          </div>
        </div>
      </div>
  );
};

export default InventoryPage;
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InventoryCategoryCard from "../components/Inventory/InventoryCategoryCard";
import InventoryTable from "../components/Inventory/InventoryTable";
import InventoryEditCard from "../components/Inventory/InventoryEditCard";
import SearchSortBar from "../components/SearchSortBar";
import EditInventoryButton from "../components/Buttons/EditInventoryButton";
import AddNewDropdownButton from "../components/Buttons/AddNewDropdownButton";
import AddCategoryModal from "../components/Modals/AddCategoryModal";
import AddItemModal from "../components/Modals/AddItemModal";
import EditItemModal from "../components/Modals/EditItemModal";
import EditCategoryModal from "../components/Modals/EditCategoryModal";
import { toast } from "react-toastify";
import { getAllInventoryItems,
  updateInventoryItemStatus,
  createInventoryItem,
  createCategory,
  getAllCategories,
  getGroupedInventoryItems,
  updateCategory,
  updateInventoryItem,
  deleteInventoryItem,
  deleteCategory,
} from "../service/api.services";

const InventoryPage = () => {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("Sort By");
  const [data, setData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Estados para modo edición
  const [editQuery, setEditQuery] = useState("");
  const [groupedData, setGroupedData] = useState({});
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editItemData, setEditItemData] = useState(null);
  const [showEditItemModal, setShowEditItemModal] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(true);
    fetchEditData();
  };

  const handleBackToView = () => {
    setIsEditMode(false);
    fetchData(); // Recargar datos de visualización
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

  const fetchEditData = async () => {
    try {
      const [catResponse, groupedResponse] = await Promise.all([
        getAllCategories(),
        getGroupedInventoryItems(),
      ]);

      if (catResponse.status === 200 && groupedResponse.status === 200) {
        const allCategories = catResponse.data;
        const grouped = groupedResponse.data.data || groupedResponse.data || {};

        setCategories(allCategories);

        const merged = {};
        allCategories.forEach((cat) => {
          merged[cat.name] = grouped[cat.name] || [];
        });

        setGroupedData(merged);
        setItems(Object.values(grouped).flat());
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error cargando datos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && Object.keys(groupedData).length > 0) {
      if (editQuery.trim()) {
        // Si hay búsqueda, buscar en todos los productos de todas las categorías
        const filtered = Object.entries(groupedData)
          .map(([category, products]) => {
            // Filtrar productos que coincidan con la búsqueda
            const matchingProducts = products.filter((product) =>
              product.name?.toLowerCase().includes(editQuery.toLowerCase()) ||
              product.description?.toLowerCase().includes(editQuery.toLowerCase()) ||
              product.type?.toLowerCase().includes(editQuery.toLowerCase()) ||
              category.toLowerCase().includes(editQuery.toLowerCase())
            );
            // Solo incluir la categoría si tiene productos que coinciden
            return matchingProducts.length > 0 ? [category, matchingProducts] : null;
          })
          .filter(Boolean) // Eliminar nulls
          .sort((a, b) => a[0].localeCompare(b[0]));

        setFilteredCategories(filtered);
      } else {
        // Si no hay búsqueda, mostrar todas las categorías
        const allCategories = Object.entries(groupedData)
          .sort((a, b) => a[0].localeCompare(b[0]));
        setFilteredCategories(allCategories);
      }
    } else {
      setFilteredCategories([]);
    }
  }, [editQuery, groupedData, isEditMode]);

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

  // Si hay búsqueda, buscar en todas las categorías
  let filteredData = [];
  
  if (query.trim()) {
    // Buscar en todos los productos de todas las categorías
    Object.values(categoriesMap).forEach((cat) => {
      const matchingProducts = cat.products.filter((product) =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.type?.toLowerCase().includes(query.toLowerCase())
      );
      filteredData.push(...matchingProducts);
    });
  } else {
    // Si no hay búsqueda, mostrar solo la categoría seleccionada
    if (selectedCategoryId && categoriesMap[selectedCategoryId]) {
      filteredData = categoriesMap[selectedCategoryId].products;
    }
  }

  // Funciones para modo edición
  const countProductsInCategory = (categoryId) => {
    return items.filter((item) => item.categoryId === categoryId).length;
  };

  const handleSaveItem = async (newItem) => {
    try {
      await createInventoryItem(newItem);
      toast.success("Producto creado correctamente");
      setShowAddItemModal(false);
      fetchEditData();
      fetchData();
    } catch (error) {
      toast.error("Error al guardar producto");
    }
  };

  const handleSaveCategory = async (newCategory) => {
    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === newCategory.toLowerCase()
    );

    if (categoryExists) {
      toast.warning("La categoría ya existe");
      return;
    }

    try {
      await createCategory({ name: newCategory });
      toast.success("Categoría creada correctamente");
      setShowAddCategoryModal(false);
      fetchEditData();
      fetchData();
    } catch (error) {
      toast.error("Error al guardar categoría");
    }
  };

  const handleEditSection = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (category) {
      setEditCategoryData(category);
      setShowEditCategoryModal(true);
    }
  };

  const handleEditItem = (item) => {
    setEditItemData(item);
    setShowEditItemModal(true);
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      await updateCategory(updatedCategory.id, { name: updatedCategory.name });
      toast.success("Categoría actualizada correctamente");
      setShowEditCategoryModal(false);
      fetchEditData();
      fetchData();
    } catch (error) {
      toast.error("Error actualizando categoría");
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      await updateInventoryItem(updatedItem.id, updatedItem);
      toast.success("Producto actualizado correctamente");
      setShowEditItemModal(false);
      fetchEditData();
      fetchData();
    } catch (error) {
      toast.error("Error actualizando producto");
    }
  };

  const handleDeleteCategory = async (id) => {
    const count = countProductsInCategory(id);

    if (count > 0) {
      toast.warning("No se puede borrar categoría con productos dentro");
      return;
    }

    try {
      await deleteCategory(id);
      toast.success("Categoría eliminada correctamente");
      setShowEditCategoryModal(false);
      fetchEditData();
      fetchData();
    } catch (error) {
      toast.error("Error al eliminar categoría");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventoryItem(id);
      toast.success("Producto eliminado correctamente");
      setShowEditItemModal(false);
      fetchEditData();
      fetchData();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error("Error eliminando producto");
    }
  };

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

  // Modo edición
  if (isEditMode) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SearchSortBar
              query={editQuery}
              setQuery={setEditQuery}
              onSearch={() => {}}
              onSortChange={() => {}}
              initialSort="Sort By"
              options={[]}
            />
          </div>
          <div className="flex items-center gap-3">
            <AddNewDropdownButton
              onAddCategory={() => setShowAddCategoryModal(true)}
              onAddItem={() => setShowAddItemModal(true)}
            />
            <button
              onClick={handleBackToView}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              Volver
            </button>
          </div>
        </div>

        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">
              {editQuery ? "No se encontraron productos o categorías con ese término" : "No hay categorías disponibles"}
            </p>
          </div>
        )}

        {filteredCategories.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredCategories.map(([category, products], idx) => (
              <InventoryEditCard
                key={category}
                category={category}
                products={products}
                onEdit={() => handleEditSection(category)}
                onItemEdit={handleEditItem}
                isFirst={idx === 0}
                isLast={idx === filteredCategories.length - 1}
              />
            ))}
          </div>
        )}

        {showAddCategoryModal && (
          <AddCategoryModal
            isOpen={showAddCategoryModal}
            onClose={() => setShowAddCategoryModal(false)}
            onSave={handleSaveCategory}
          />
        )}

        {showAddItemModal && (
          <AddItemModal
            isOpen={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            onSave={handleSaveItem}
            categories={categories}
          />
        )}

        {showEditItemModal && (
          <EditItemModal
            isOpen={showEditItemModal}
            onClose={() => {
              setShowEditItemModal(false);
              setEditItemData(null);
            }}
            item={editItemData}
            categories={categories}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        )}

        {showEditCategoryModal && (
          <EditCategoryModal
            isOpen={showEditCategoryModal}
            onClose={() => {
              setShowEditCategoryModal(false);
              setEditCategoryData(null);
            }}
            category={editCategoryData}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
            productCount={countProductsInCategory(editCategoryData?.id)}
          />
        )}
      </div>
    );
  }

  // Modo visualización
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
              query.trim() 
                ? `Resultados de búsqueda (${filteredData.length})` 
                : categoriesMap[selectedCategoryId]?.name || "Sin categoría"
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
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import InventoryEditCard from "../components/Inventory/InventoryEditCard";
import EditCategoryModal from "../components/Modals/EditCategoryModal"
import SearchSortBar from "../components/SearchSortBar";
import AddNewDropdownButton from "../components/Buttons/AddNewDropdownButton";
import AddCategoryModal from "./Modals/AddCategoryModal";
import AddItemModal from "./Modals/AddItemModal";
import EditItemModal from "../components/Modals/EditItemModal"


import {
  createInventoryItem,
  createCategory,
  getAllCategories,
  getGroupedInventoryItems,
  updateCategory,
  updateInventoryItem,
  deleteInventoryItem,
  deleteCategory,
} from "../service/api.services";

const EditInventoryPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
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

  const countProductsInCategory = (categoryId) => {
  return items.filter((item) => item.categoryId === categoryId).length;
  };

  const fetchData = async () => {
  try {
    const [catResponse, groupedResponse] = await Promise.all([
      getAllCategories(),
      getGroupedInventoryItems(),
    ]);

    if (catResponse.status === 200 && groupedResponse.status === 200) {
      const allCategories = catResponse.data;
      const grouped = groupedResponse.data.data;

      setCategories(allCategories);

      const merged = {};
      allCategories.forEach((cat) => {
        merged[cat.name] = grouped[cat.name] || [];
      });

      setGroupedData(merged);
      setItems(Object.values(grouped).flat());
    }
  } catch (error) {
    toast.error("Error cargando datos");
  }
};

  useEffect(() => {
  if (Object.keys(groupedData).length > 0) {
    const filtered = Object.entries(groupedData)
      .filter(([category]) =>
        category.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a[0].localeCompare(b[0]));

    setFilteredCategories(filtered);
  }
}, [query, groupedData]);

  // Cargar datos desde API
 useEffect(() => {

  fetchData();
}, []);



  const handleSaveItem = async (newItem) => {
    try {
      await createInventoryItem(newItem);
      toast.success("Producto creado correctamente");
      setShowAddItemModal(false);
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
    fetchData(); // ✅ ya funciona aquí
  } catch (error) {
    toast.error("Error al guardar categoría");
  }
};
const handleEditSection = (categoryName) => {
  const category = categories.find((cat) => cat.name === categoryName);
  if (category) {
    setEditCategoryData(category);               // Guardas la categoría seleccionada
    setShowEditCategoryModal(true);              // Abres el modal
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
    fetchData();
  } catch (error) {
    toast.error("Error actualizando categoría");
  }
};

const handleUpdateItem = async (updatedItem) => {
  try {
    await updateInventoryItem(updatedItem.id, updatedItem);
    toast.success("Producto actualizado correctamente");
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
    fetchData();
  } catch (error) {
    toast.error("Error al eliminar categoría");
  }
};

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventoryItem(id);
      toast.success("Producto eliminado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error("Error eliminando producto");
    }
  };

  return (
    <Layout
      headerTitle="Edit Inventory"
      backTo="/admin"
      backLabel="Administrador de Inventario"
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <SearchSortBar
              query={query}
              setQuery={setQuery}
              onSearch={() => {}} 
              onSortChange={() => {}}
            />
          </div>

          <div className="shrink-0">
            <AddNewDropdownButton
              onAddCategory={() => setShowAddCategoryModal(true)}
              onAddItem={() => setShowAddItemModal(true)}
            />
          </div>
        </div>

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
              onClose={() => setShowEditItemModal(false)}
              item={editItemData}
              categories={categories}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          )}

          {showEditCategoryModal && (
            <EditCategoryModal
              isOpen={showEditCategoryModal}
              onClose={() => setShowEditCategoryModal(false)}
              category={editCategoryData}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
              productCount={countProductsInCategory(editCategoryData?.id)} // ✅ NUEVO
            />
          )}

        <div>
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
      </div>
    </Layout>
  );
};

export default EditInventoryPage;

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import InventoryEditCard from "./InventoryEditCard";
import EditCategoryModal from "../Modals/EditCategoryModal";
import SearchSortBar from "../SearchSortBar";
import AddNewDropdownButton from "../Buttons/AddNewDropdownButton";
import AddCategoryModal from "../Modals/AddCategoryModal";
import AddItemModal from "../Modals/AddItemModal";
import EditItemModal from "../Modals/EditItemModal";
import {
  createInventoryItem,
  createCategory,
  getAllCategories,
  getGroupedInventoryItems,
  updateCategory,
  updateInventoryItem,
  deleteInventoryItem,
  deleteCategory,
} from "../../service/api.services";

const EditInventoryPanel = ({ isOpen, onClose, onSuccess }) => {
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
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (Object.keys(groupedData).length > 0) {
      const filtered = Object.entries(groupedData)
        .filter(([category]) =>
          category.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a[0].localeCompare(b[0]));

      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [query, groupedData]);

  const handleSaveItem = async (newItem) => {
    try {
      await createInventoryItem(newItem);
      toast.success("Producto creado correctamente");
      setShowAddItemModal(false);
      fetchData();
      onSuccess?.();
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
      fetchData();
      onSuccess?.();
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
      fetchData();
      onSuccess?.();
    } catch (error) {
      toast.error("Error actualizando categoría");
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      await updateInventoryItem(updatedItem.id, updatedItem);
      toast.success("Producto actualizado correctamente");
      setShowEditItemModal(false);
      fetchData();
      onSuccess?.();
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
      onSuccess?.();
    } catch (error) {
      toast.error("Error al eliminar categoría");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventoryItem(id);
      toast.success("Producto eliminado correctamente");
      setShowEditItemModal(false);
      fetchData();
      onSuccess?.();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error("Error eliminando producto");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Editar Inventario</h2>
          <div className="w-20" /> {/* Spacer para centrar el título */}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <SearchSortBar
                query={query}
                setQuery={setQuery}
                onSearch={() => {}}
                onSortChange={() => {}}
                initialSort="Sort By"
                options={[]}
              />
            </div>

            <div className="shrink-0">
              <AddNewDropdownButton
                onAddCategory={() => setShowAddCategoryModal(true)}
                onAddItem={() => setShowAddItemModal(true)}
              />
            </div>
          </div>

          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-lg">
                {query ? "No se encontraron categorías con ese nombre" : "No hay categorías disponibles"}
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
    </div>,
    document.body
  );
};

export default EditInventoryPanel;


import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getLowStockItems } from "../../service/api.services";
import { toast } from "react-toastify";

const LowStockAlert = ({ onItemClick, isCollapsed = false }) => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const fetchLowStockItems = async () => {
    try {
      setLoading(true);
      const res = await getLowStockItems();
      if (res.status === 200) {
        const items = res.data?.data || res.data || [];
        setLowStockItems(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Error obteniendo items con stock bajo:", error);
      setLowStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
    // Refrescar cada 30 segundos como fallback
    const interval = setInterval(fetchLowStockItems, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Cargando alertas...</span>
        </div>
      </div>
    );
  }

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
        <div className="flex items-center gap-2 text-green-700">
          <FaExclamationTriangle className="text-green-600" />
          <span className="text-sm font-medium">Todo el stock está en niveles normales</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 rounded-xl shadow-sm border-2 border-red-200 overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-red-600 text-lg" />
          <span className="font-semibold text-red-900">
            Stock Bajo ({lowStockItems.length} {lowStockItems.length === 1 ? "artículo" : "artículos"})
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-200 text-red-800">
            {lowStockItems.length}
          </span>
        </div>
        {collapsed ? (
          <FaChevronDown className="text-red-600" />
        ) : (
          <FaChevronUp className="text-red-600" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick && onItemClick(item)}
              className={`flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 hover:border-red-300 hover:shadow-sm transition-all ${
                onItemClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{item.name || item.itemName || "Sin nombre"}</div>
                {(item.categoryName || item.category?.name) && (
                  <div className="text-xs text-gray-500 mt-0.5">{item.categoryName || item.category?.name}</div>
                )}
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">
                    {item.quantity ?? item.itemQuantity ?? 0} / {item.minimumStock ?? 0}
                  </div>
                  <div className="text-xs text-gray-500">unidades</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;


import { FaChevronRight } from "react-icons/fa";
const InventoryCategoryCard = ({ title, productCount, unavailableCount, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all duration-200
        ${selected 
          ? "border-[#D9C696] bg-gray-50 border-2 shadow-md" 
          : "border-gray-200 bg-white hover:border-[#D9C696] hover:shadow-md"
        }`}
    >
      <div>
        <div className="text-lg font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{productCount} Productos</div>
      </div>

      <div className="flex items-center gap-2">
        {unavailableCount > 0 && (
          <span className="w-8 h-8 text-xs font-semibold text-center bg-red-100 text-red-700 rounded-full flex items-center justify-center">
            {unavailableCount}
          </span>
        )}
        <FaChevronRight className={`text-sm transition-colors ${selected ? "text-[#D9C696]" : "text-gray-400"}`} />
      </div>
    </div>
  );
};

export default InventoryCategoryCard;

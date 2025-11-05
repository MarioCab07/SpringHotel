import { FaChevronRight } from "react-icons/fa";
const InventoryCategoryCard = ({ title, productCount, unavailableCount, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border border-[#2A3E4C] rounded-lg px-4 py-2 shadow-sm flex items-center justify-between 
        ${selected ? "border-[#2A3E4C] bg-white border-2" : "border-[#1a1a1a] bg-white"} hover:border-2 hover:border-[#2A3E4C] transition-colors`}
    >
      <div>
        <div className="text-xl font-semibold text-[#1a1a1a]">{title}</div>
        <div className="text-m text-gray-500">{productCount} Productos</div>
      </div>

      <div className="flex items-center gap-2">
        <span className=" w-10 h-10 text-l font-semibold text-center bg-gray-200 rounded-full flex items-center justify-center">
          {unavailableCount}
        </span>
        <FaChevronRight className="text-sm text-[#1a1a1a]" />
      </div>
    </div>
  );
};

export default InventoryCategoryCard;

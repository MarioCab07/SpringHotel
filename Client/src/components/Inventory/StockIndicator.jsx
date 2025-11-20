import { FaExclamationTriangle } from "react-icons/fa";

const StockIndicator = ({ quantity, minimumStock, showMinimum = false }) => {
  if (!minimumStock || minimumStock === 0) {
    // Si no hay mínimo definido, mostrar normal
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {quantity} uds
        </span>
        {showMinimum && (
          <span className="text-xs text-gray-500">(mín: {minimumStock})</span>
        )}
      </div>
    );
  }

  const isLowStock = quantity < minimumStock;
  const isWarning = quantity < minimumStock * 1.5;

  return (
    <div className="flex items-center gap-2">
      {isLowStock && (
        <FaExclamationTriangle className="text-red-500 text-sm flex-shrink-0" title="Stock bajo" />
      )}
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          isLowStock
            ? "text-red-600 font-bold"
            : isWarning
            ? "text-yellow-600 font-semibold"
            : "text-gray-700"
        }`}
      >
        {quantity} uds
      </span>
      {showMinimum && (
        <span
          className={`text-xs ${
            isLowStock ? "text-red-500" : "text-gray-500"
          }`}
        >
          (mín: {minimumStock})
        </span>
      )}
      {isLowStock && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300"
          title={`Stock por debajo del mínimo (${minimumStock})`}
        >
          Bajo
        </span>
      )}
    </div>
  );
};

export default StockIndicator;


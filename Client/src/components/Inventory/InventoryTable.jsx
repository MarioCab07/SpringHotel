const InventoryTable = ({ category, products, onToggleAvailability }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-[#2A3E4C]">
      <div className="px-4 py-2 font-bold text-3xl border-b border-[#2A3E4C]">
        {category}
      </div>
      <table className="w-full text-left">
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="hover:bg-gray-50">
              <td className="px-8 py-3 w-full">
                <div className="font-bold text-xl">{prod.name}</div>
                <div className="text-sm text-[#00000080]">{prod.description}</div>
                <div className="text-sm text-[#4B5563] italic pt-1">{prod.type}</div>
              </td>

              <td className="pr-8">
                <div className="flex items-center gap-4 justify-end">
                  <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {prod.quantity ?? 0} uds
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={`availability-${prod.id}`}
                      name={`availability-${prod.id}`}
                      checked={prod.available}
                      onChange={() => onToggleAvailability(prod.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300" />
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-5" />
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;

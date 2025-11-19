import React from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const MaterialRequestList = ({ requests, onRefresh }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheckCircle className="text-green-500" />;
      case "PENDING":
        return <FaClock className="text-yellow-500" />;
      case "REJECTED":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED":
        return "Aprobada";
      case "PENDING":
        return "Pendiente";
      case "REJECTED":
        return "Rechazada";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No hay solicitudes realizadas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Mis Solicitudes ({requests.length})
          </h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-sm text-[#D9C696] hover:text-[#c5b386] font-medium"
            >
              Actualizar
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artículos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Unidades
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => {
              const totalQuantity = request.items.reduce(
                (sum, item) => sum + (item.requestedQuantity || 0),
                0
              );

              return (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(request.requestDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-xs">
                      <div className="space-y-1">
                        {request.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-xs">
                            • {item.itemName} ({item.requestedQuantity} uds)
                          </div>
                        ))}
                        {request.items.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{request.items.length - 2} más...
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {totalQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="text-sm text-gray-700">
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {request.notes || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialRequestList;


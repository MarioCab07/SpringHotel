import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaClock, FaTimesCircle, FaEye } from "react-icons/fa";
import {
  getAllMaterialRequests,
  getMaterialRequestById,
} from "../../service/api.services";

const MaterialRequestsView = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllMaterialRequests();
      setRequests(res.data.data);
    } catch (err) {
      console.error("Error loading requests:", err);
      toast.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getMaterialRequestById(id);
      setSelectedRequest(res.data.data);
      setShowDetail(true);
    } catch (err) {
      console.error("Error loading request detail:", err);
      toast.error("Error al cargar los detalles");
    }
  };

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

  if (showDetail && selectedRequest) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalles de Solicitud #{selectedRequest.id}
          </h3>
          <button
            onClick={() => {
              setShowDetail(false);
              setSelectedRequest(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Solicitado por</label>
              <p className="text-sm font-medium text-gray-900">
                {selectedRequest.requestedByName} ({selectedRequest.requestedByUsername})
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Fecha</label>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(selectedRequest.requestDate)}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Estado</label>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedRequest.status)}
                <span className="text-sm font-medium text-gray-900">
                  {getStatusLabel(selectedRequest.status)}
                </span>
              </div>
            </div>
            {selectedRequest.notes && (
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Notas</label>
                <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Artículos Solicitados
            </h4>
            <div className="space-y-2">
              {selectedRequest.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.itemName}
                    </p>
                    <p className="text-xs text-gray-500">{item.itemType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.requestedQuantity} unidades
                    </p>
                    <p className="text-xs text-gray-500">
                      Stock disponible: {item.availableStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Solicitudes de Materiales ({requests.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={loadRequests}
            className="text-sm text-[#D9C696] hover:text-[#c5b386] font-medium"
          >
            Actualizar
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No hay solicitudes registradas</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artículos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
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
                      {request.requestedByName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetail(request.id)}
                        className="text-[#D9C696] hover:text-[#c5b386] transition-colors"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestsView;


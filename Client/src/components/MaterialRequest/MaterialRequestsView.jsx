import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaSun, FaMoon, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getAllMaterialRequests,
  getMaterialRequestById,
} from "../../service/api.services";

const MaterialRequestsView = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  // Función auxiliar para parsear la fecha que viene del backend
  // Maneja diferentes formatos: string ISO, array [año, mes, día, hora, minuto, segundo], etc.
  const parseDate = (dateValue) => {
    if (!dateValue) return null;
    
    let year, month, day, hour, minute, second;
    
    if (Array.isArray(dateValue)) {
      // Si viene como array de Jackson [año, mes, día, hora, minuto, segundo, nanosegundo]
      [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
      month = month - 1; // JavaScript meses van de 0-11
      return new Date(year, month, day, hour, minute, second);
    } else if (typeof dateValue === 'string') {
      // Si viene como string ISO (ej: "2025-11-20T10:30:00")
      // O como string de array (ej: "[2025,11,20,10,30,0]")
      if (dateValue.startsWith('[')) {
        try {
          const dateArray = JSON.parse(dateValue);
          [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
          month = month - 1;
          return new Date(year, month, day, hour, minute, second);
        } catch (e) {
          // Si falla el parse, intentar como ISO string
          return new Date(dateValue);
        }
      } else {
        // String ISO - extraer componentes para evitar problemas de zona horaria
        // Formato esperado: "2025-11-20T10:30:00" o "2025-11-20T10:30:00.123456" o "2025-11-20T10:30:00.123"
        // También puede venir sin 'T': "2025-11-20 10:30:00"
        let match = dateValue.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/);
        if (match) {
          [, year, month, day, hour, minute, second] = match.map(Number);
          month = month - 1; // JavaScript meses van de 0-11
          // Crear fecha usando valores locales directamente (sin conversión de zona horaria)
          return new Date(year, month, day, hour, minute, second || 0);
        }
        // Si no coincide con el patrón, intentar parsear como ISO string
        // Pero si tiene 'Z' al final (UTC), removerlo para tratarlo como local
        const dateStr = dateValue.endsWith('Z') ? dateValue.slice(0, -1) : dateValue;
        const parsedDate = new Date(dateStr);
        // Si la fecha parseada es válida, extraer componentes y reconstruir como local
        if (!isNaN(parsedDate.getTime())) {
          // Usar los componentes de la fecha parseada pero tratarla como local
          return new Date(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
            parsedDate.getHours(),
            parsedDate.getMinutes(),
            parsedDate.getSeconds()
          );
        }
        return parsedDate;
      }
    } else {
      return new Date(dateValue);
    }
  };

  // Calcular el turno basado en la hora de la solicitud
  const calculateShift = (dateValue) => {
    const date = parseDate(dateValue);
    if (!date || isNaN(date.getTime())) {
      console.error("Fecha inválida para calcular turno:", dateValue);
      return null;
    }
    
    // Obtener hora en zona horaria local
    const hour = date.getHours();
    // MORNING: 6:00 AM - 6:00 PM (6-17)
    // EVENING: 6:00 PM - 6:00 AM (18-5)
    return hour >= 6 && hour < 18 ? "MORNING" : "EVENING";
  };

  // Obtener la fecha del turno basada en la fecha y hora real de la solicitud
  const getShiftDate = (dateValue) => {
    const date = parseDate(dateValue);
    if (!date || isNaN(date.getTime())) {
      console.error("Fecha inválida para obtener fecha de turno:", dateValue);
      return null;
    }
    
    const hour = date.getHours();
    
    // Para EVENING shift (18:00 - 05:59): 
    // - Si la hora está entre 0:00 y 5:59, el turno pertenece al día anterior
    // - Si la hora está entre 18:00 y 23:59, el turno pertenece al día actual
    if (hour >= 0 && hour < 6) {
      // Es turno EVENING que comenzó el día anterior
      const previousDay = new Date(date);
      previousDay.setDate(previousDay.getDate() - 1);
      // Usar métodos locales para obtener fecha sin depender de zona horaria
      const year = previousDay.getFullYear();
      const month = String(previousDay.getMonth() + 1).padStart(2, '0');
      const day = String(previousDay.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // Para MORNING shift (6:00 - 17:59) o EVENING shift después de las 18:00
    // La fecha del turno es la fecha actual de la solicitud
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Retorna YYYY-MM-DD
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllMaterialRequests();
      const allRequests = res.data.data || [];
      console.log("Total de solicitudes recibidas:", allRequests.length);
      
      // Log para verificar formato de fechas
      if (allRequests.length > 0) {
        const firstRequest = allRequests[0];
        console.log("Primera solicitud (ejemplo):", {
          id: firstRequest.id,
          requestDate: firstRequest.requestDate,
          requestDateType: typeof firstRequest.requestDate,
          requestDateIsArray: Array.isArray(firstRequest.requestDate),
          fechaParseada: parseDate(firstRequest.requestDate)?.toLocaleString("es-ES"),
          fechaCalculada: parseDate(firstRequest.requestDate) ? {
            año: parseDate(firstRequest.requestDate).getFullYear(),
            mes: parseDate(firstRequest.requestDate).getMonth() + 1,
            día: parseDate(firstRequest.requestDate).getDate(),
            hora: parseDate(firstRequest.requestDate).getHours()
          } : null
        });
      }
      
      setRequests(allRequests);
      
      // Preservar el estado de expandedGroups existente y solo agregar nuevos grupos como colapsados
      setExpandedGroups((prevExpandedGroups) => {
        // Si no hay estado previo (primera carga), colapsar todos los grupos
        const isFirstLoad = Object.keys(prevExpandedGroups).length === 0;
        if (isFirstLoad) {
          // En la primera carga, todos los grupos empiezan colapsados
          return {};
        } else {
          // En actualizaciones posteriores, preservar el estado actual
          return prevExpandedGroups;
        }
      });
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

  const formatShiftDate = (dateString) => {
    if (!dateString) return "N/A";
    // dateString viene como "YYYY-MM-DD", parsearlo directamente sin problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) {
      // Si el formato no es el esperado, intentar parsearlo como fecha
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    // Crear fecha usando los componentes directamente (mes - 1 porque JS meses van de 0-11)
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Agrupar solicitudes por turno y fecha
  const groupedRequests = useMemo(() => {
    const groups = {};
    
    requests.forEach(request => {
      // Log para debug
      console.log("Procesando solicitud:", {
        id: request.id,
        requestDate: request.requestDate,
        requestDateType: typeof request.requestDate
      });
      
      const shift = calculateShift(request.requestDate);
      const shiftDate = getShiftDate(request.requestDate);
      
      // Log para debug
      console.log("Solicitud procesada:", {
        id: request.id,
        requestDate: request.requestDate,
        shift: shift,
        shiftDate: shiftDate,
        fechaCalculada: new Date(request.requestDate).toLocaleString("es-ES")
      });
      
      if (!shift || !shiftDate) {
        console.warn("Solicitud sin turno o fecha válida:", request);
        return;
      }
      
      const key = `${shiftDate}_${shift}`;
      
      if (!groups[key]) {
        groups[key] = {
          shift,
          shiftDate,
          requests: []
        };
      }
      
      groups[key].requests.push(request);
    });
    
    console.log("Grupos formados:", Object.keys(groups).map(key => {
      const group = groups[key];
      return `${key}: ${group.requests.length} solicitudes`;
    }));
    
    // Ordenar grupos por fecha descendente, luego por turno (MORNING primero)
    return Object.values(groups).sort((a, b) => {
      if (a.shiftDate !== b.shiftDate) {
        return b.shiftDate.localeCompare(a.shiftDate);
      }
      // Si es la misma fecha, MORNING primero
      return a.shift === 'MORNING' ? -1 : 1;
    });
  }, [requests]);

  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Comentarios/Notas</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedRequest.notes || "Sin comentarios"}
                </p>
              </div>
            </div>
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
        <div className="space-y-3">
          {groupedRequests.map((group) => {
            const groupKey = `${group.shiftDate}_${group.shift}`;
            const isExpanded = expandedGroups[groupKey] || false;
            
            return (
              <div key={groupKey} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header del grupo de turno (clickeable) */}
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className={`w-full px-6 py-4 border-b-2 transition-all ${
                    group.shift === "MORNING" 
                      ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 hover:from-yellow-100 hover:to-yellow-200" 
                      : "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400 hover:from-gray-200 hover:to-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {group.shift === "MORNING" ? (
                      <FaSun className="text-yellow-500 text-2xl" />
                    ) : (
                      <FaMoon className="text-gray-600 text-2xl" />
                    )}
                    <div className="flex-1 text-left">
                      <h4 className={`text-lg font-semibold ${
                        group.shift === "MORNING" ? "text-yellow-900" : "text-gray-900"
                      }`}>
                        {group.shift === "MORNING" ? "Morning Shift" : "Evening Shift"}
                      </h4>
                      <p className={`text-sm ${
                        group.shift === "MORNING" ? "text-yellow-700" : "text-gray-700"
                      }`}>
                        {formatShiftDate(group.shiftDate)} - {group.requests.length} solicitud{group.requests.length !== 1 ? 'es' : ''}
                      </p>
                      <p className={`text-xs mt-1 ${
                        group.shift === "MORNING" ? "text-yellow-600" : "text-gray-600"
                      }`}>
                        {group.shift === "MORNING" ? "06:00 AM – 06:00 PM" : "06:00 PM – 06:00 AM"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {isExpanded ? (
                        <FaChevronUp className={`text-lg ${
                          group.shift === "MORNING" ? "text-yellow-700" : "text-gray-700"
                        }`} />
                      ) : (
                        <FaChevronDown className={`text-lg ${
                          group.shift === "MORNING" ? "text-yellow-700" : "text-gray-700"
                        }`} />
                      )}
                    </div>
                  </div>
                </button>

                {/* Tabla de solicitudes del grupo (colapsable) */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Solicitado por
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha y Hora
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
                            Comentarios/Notas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {group.requests.map((request) => {
                          const totalQuantity = request.items.reduce(
                            (sum, item) => sum + (item.requestedQuantity || 0),
                            0
                          );

                          return (
                            <tr
                              key={request.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
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
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                {request.notes ? (
                                  <div className="bg-gray-50 rounded px-2 py-1 border border-gray-200">
                                    <p className="text-xs text-gray-700 break-words line-clamp-2">
                                      {request.notes}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic text-xs">Sin comentarios</span>
                                )}
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
          })}
        </div>
      )}
    </div>
  );
};

export default MaterialRequestsView;


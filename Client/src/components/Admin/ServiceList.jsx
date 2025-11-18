import { useEffect, useState } from "react";
import { getAllServicesTypes } from "../../service/api.services";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import RegisterServiceType from "./RegisterServiceType";
import UpdateServiceType from "./UpdateServiceType";
import DeleteServiceType from "./DeleteServiceType";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const role = sessionStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getAllServicesTypes();
      if (response.status === 200) {
        setServices(response.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar los servicios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openUpdateModal = (service) => {
    setSelectedService(service);
    setShowUpdate(true);
  };
  const closeUpdateModal = () => {
    setShowUpdate(false);
    setSelectedService(null);
  };

  const handleUpdateSuccess = () => {
    setShowUpdate(false);
    setSelectedService(null);
    fetchServices();
  };
  const openCreateModal = () => {
    setShowCreate(true);
  };
  const closeCreateModal = () => {
    setShowCreate(false);
  };
  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchServices();
  };
  const openDeleteModal = (service) => {
    setSelectedService(service);
    setShowDelete(true);
  };
  const closeDeleteModal = () => {
    setShowDelete(false);
    setSelectedService(null);
  };
  const handleDeleteSuccess = () => {
    setShowDelete(false);
    setSelectedService(null);
    fetchServices();
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        {isAdmin && (
          <div className="w-full flex justify-end">
            <button
              onClick={openCreateModal}
              className="bg-pink-400 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Crear Servicio
            </button>
          </div>
        )}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {loading && <Loading fullscreen={false} />}
          {!loading && services.length === 0 && (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold text-gray-600">
                No hay servicios registrados
              </h2>
            </div>
          )}

          {!loading && services.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Service
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    {isAdmin && (
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3 text-sm text-gray-600">{service.id}</td>
                      <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                        {service.name}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        ${service.price}
                      </td>
                      {isAdmin && (
                        <td className="py-2 px-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openUpdateModal(service)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              <BsPencilSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(service)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <AiFillDelete className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
        {isAdmin && showCreate && (
          <RegisterServiceType
            onClose={closeCreateModal}
            onSuccess={handleCreateSuccess}
          />
        )}
        {isAdmin && showUpdate && (
          <UpdateServiceType
            service={selectedService}
            onClose={closeUpdateModal}
            onSuccess={handleUpdateSuccess}
          />
        )}
        {isAdmin && showDelete && (
          <DeleteServiceType
            service={selectedService}
            onClose={closeDeleteModal}
            onSuccess={handleDeleteSuccess}
          />
        )}
    </>
  );
};

export default ServiceList;

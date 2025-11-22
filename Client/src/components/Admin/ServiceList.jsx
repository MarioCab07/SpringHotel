import { useEffect, useState } from "react";
import { getAllServicesTypes } from "../../service/api.services";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import RegisterServiceType from "./RegisterServiceType";
import ServiceDetailPanel from "./ServiceDetailPanel";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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
      toast.error("Error loading services: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openDetailPanel = (service) => {
    setSelectedService(service);
    setShowDetailPanel(true);
  };
  const closeDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedService(null);
  };
  const handleDetailSuccess = () => {
    setShowDetailPanel(false);
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

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        {isAdmin && (
          <div className="w-full flex justify-end">
            <button
              onClick={openCreateModal}
              className="px-5 py-2 bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
            >
              Create Service
            </button>
          </div>
        )}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {loading && <Loading fullscreen={false} />}
          {!loading && services.length === 0 && (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold text-gray-600">
                No services registered
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
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      onClick={() => isAdmin && openDetailPanel(service)}
                      className={`border-b border-gray-100 transition-colors ${
                        isAdmin ? "cursor-pointer hover:bg-gray-50" : ""
                      }`}
                    >
                      <td className="py-2 px-3 text-sm text-gray-600">{service.id}</td>
                      <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                        {service.name}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        ${service.price}
                      </td>
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
            isOpen={showCreate}
            onClose={closeCreateModal}
            onSuccess={handleCreateSuccess}
          />
        )}
        {isAdmin && showDetailPanel && (
          <ServiceDetailPanel
            isOpen={showDetailPanel}
            service={selectedService}
            onClose={closeDetailPanel}
            onSuccess={handleDetailSuccess}
          />
        )}
    </>
  );
};

export default ServiceList;

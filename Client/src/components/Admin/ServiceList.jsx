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
      <article className="w-full h-full flex flex-col gap-4 items-center justify-between relative">
        <h4
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          className="rounded-b-2xl bg-white font-zain-extrabold p-4 w-1/3 text-3xl text-center"
        >
          Listado de Servicios
        </h4>

        {isAdmin && (
          <div className="w-full flex justify-end px-4">
            <button
              onClick={openCreateModal}
              className="bg-pink-400 hover:bg-pink-600 text-white py-2 px-4 rounded-lg shadow-md"
            >
              Crear Servicio
            </button>
          </div>
        )}

        <div className="w-full h-full flex-1  flex flex-col py-5 items-center justify-center overflow-scroll">
          {loading && <Loading fullscreen={false} />}
          {!loading && services.length === 0 && (
            <>
              <h2 className="text-center text-2xl font-bold">
                No hay habitaciones registradas
              </h2>
            </>
          )}

          {!loading && services.length > 0 && (
            <>
              <div
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                className="w-1/2 max-w-8xl h-full mx-auto p-4 bg-white rounded-3xl"
              >
                <div
                  className={
                    `grid gap-2 mb-4 text-center font-bold ` +
                    (isAdmin ? "grid-cols-4" : "grid-cols-3")
                  }
                >
                  <h5 className="col-span-1 flex items-center justify-center">
                    ID
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Servicio
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Precio
                  </h5>
                </div>

                <hr />
                {services.map((service) => {
                  return (
                    <div
                      key={service.id}
                      className={
                        `grid gap-4 items-center py-4 mb-4 rounded-lg shadow ` +
                        (isAdmin ? "grid-cols-4" : "grid-cols-3")
                      }
                    >
                      <h5 className="col-span-1 flex items-center justify-center">
                        {service.id}
                      </h5>
                      <h5 className="col-span-1 flex items-center justify-center">
                        {service.name}
                      </h5>
                      <h5 className="col-span-1 flex items-center justify-center">
                        ${service.price}
                      </h5>
                      {isAdmin && (
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => openUpdate(svc)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <BsPencilSquare size={20} />
                          </button>
                          <button
                            onClick={() => openDelete(svc)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <AiFillDelete size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
      </article>
    </>
  );
};

export default ServiceList;

import { useEffect, useState } from "react";
import { GetUsersByRole } from "../../service/api.services";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import UpdateClient from "./UpdateUserComp";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userClient, setUserClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await GetUsersByRole("USER");

      if (response.status === 200) {
        setClients(response.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar los clientes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openModal = (client) => {
    setUserClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUpdateSuccess = () => {
    setShowModal(false);
    setUserClient(null);
    fetchClients();
  };

  return (
    <>
      <article className="w-full h-full flex flex-col gap-4 items-center justify-between relative">
        <h4
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          className="rounded-b-2xl bg-white font-zain-extrabold p-4 w-1/3 text-3xl text-center"
        >
          Listado de Clientes
        </h4>
        <div className="w-full h-full flex-1  flex flex-col py-5 items-center justify-center overflow-scroll">
          {loading && <Loading fullscreen={false} />}
          {!loading && clients.length === 0 && (
            <>
              <h2 className="text-center text-2xl font-bold">
                No hay clientes registrados
              </h2>
            </>
          )}

          {!loading && clients.length > 0 && (
            <>
              <div
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                className="w-full max-w-6xl h-full mx-auto p-4 bg-white rounded-3xl"
              >
                <div className="grid grid-cols-6 gap-4 mb-4 text-center font-bold">
                  <h5 className="col-span-1 flex items-center justify-center">
                    ID
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Nombre
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Teléfono
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Email
                  </h5>

                  <h5 className="col-span-1 flex items-center justify-center">
                    Usuario
                  </h5>
                </div>
                <hr />
                {clients.map((client) => {
                  return (
                    <div
                      key={client.userId}
                      className="bg-white py-4 rounded-lg shadow-md mb-4 grid grid-cols-6 gap-4 w-full"
                    >
                      <p className="text-gray-600 flex items-center justify-center">
                        {client.userId}
                      </p>
                      <h3 className="text-xl font-semibold flex items-center justify-center text-center">
                        {client.fullName}
                      </h3>
                      <p className="text-gray-600 flex items-center justify-center">
                        {client.phoneNumber}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {client.email}
                      </p>

                      <p className="text-gray-600 flex items-center justify-center">
                        {client.userName}
                      </p>
                      <button
                        onClick={() => {
                          openModal(client);
                        }}
                        className="text-gray-600 flex items-center justify-center"
                      >
                        <BsPencilSquare className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-300" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </article>
      {showModal && (
        <>
          <UpdateClient
            user={userClient}
            onClose={closeModal}
            onSuccess={handleUpdateSuccess}
          />
        </>
      )}
    </>
  );
};

export default ClientsList;

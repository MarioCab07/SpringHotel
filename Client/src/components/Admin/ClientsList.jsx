import { useEffect, useState } from "react";
import { GetUsersByRole } from "../../service/api.services";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
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
    setUserClient(null);
  };

  const handleUpdateSuccess = () => {
    setShowModal(false);
    setUserClient(null);
    fetchClients();
  };

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        {loading && <Loading fullscreen={false} />}
        {!loading && clients.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-600">
              No hay clientes registrados
            </h2>
          </div>
        )}

        {!loading && clients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Phone Number
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    User
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.userId}
                    onClick={() => openModal(client)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-2 px-3 text-sm text-gray-600">{client.userId}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                      {client.fullName}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      {client.phoneNumber}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">{client.email}</td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      {client.userName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <UpdateClient
          isOpen={showModal}
          user={userClient}
          onClose={closeModal}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default ClientsList;

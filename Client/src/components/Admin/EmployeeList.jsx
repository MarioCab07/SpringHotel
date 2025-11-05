import { useEffect, useState } from "react";
import { GetAllEmployees } from "../../service/api.services";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import RegisterEmp from "./RegisterEmp";
import UpdateEmployee from "./UpdateUserComp";
import SetRoleComp from "./SetRoleComp";
import { RiUserSettingsLine } from "react-icons/ri";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmployee, setUserEmployee] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showSetRole, setShowSetRole] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await GetAllEmployees();
      if (response.status === 200) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar los empleados: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openUpdateModal = (employee) => {
    setUserEmployee(employee);
    setShowUpdate(true);
  };
  const closeUpdateModal = () => {
    setShowUpdate(false);
    setUserEmployee(null);
  };
  const handleUpdateSuccess = () => {
    setShowUpdate(false);
    setUserEmployee(null);
    fetchEmployees();
  };

  const openCreateModal = () => {
    setShowCreate(true);
  };
  const closeCreateModal = () => {
    setShowCreate(false);
  };
  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchEmployees();
  };

  const openSetRoleModal = (employee) => {
    setUserEmployee(employee);
    setShowSetRole(true);
  };

  const closeSetRoleModal = () => {
    setShowSetRole(false);
    setUserEmployee(null);
  };
  const handleSetRoleSuccess = () => {
    setShowSetRole(false);
    setUserEmployee(null);
    fetchEmployees();
  };

  return (
    <>
      <article className="w-full h-full flex flex-col gap-4 items-center justify-between relative">
        <h4
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          className="rounded-b-2xl bg-white font-zain-extrabold p-4 w-1/3 text-3xl text-center"
        >
          Listado de Empleados
        </h4>
        <div className="w-full flex justify-end px-4 py-2">
          <button
            onClick={openCreateModal}
            style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            className="bg-pink-400 hover:bg-pink-600 transition-all ease-in-out 0.5s text-white font-bold py-2 px-4 cursor-pointer rounded-lg "
          >
            Registrar Empleado
          </button>
        </div>
        <div className="w-full h-full flex-1  flex flex-col py-5 items-center justify-center overflow-scroll">
          {loading && <Loading fullscreen={false} />}
          {!loading && employees.length === 0 && (
            <>
              <h2 className="text-center text-2xl font-bold">
                No hay clientes registrados
              </h2>
            </>
          )}

          {!loading && employees.length > 0 && (
            <>
              <div
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                className="w-full max-w-8xl h-full mx-auto p-4 bg-white rounded-3xl"
              >
                <div className="grid grid-cols-9 gap-4 mb-4 text-center font-bold">
                  <h5 className="col-span-1 flex items-center justify-center">
                    ID
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Usuario
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Email
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Nombre
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Responsabilidad
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Telefono
                  </h5>
                  <h5 className="col-span-1 flex items-center justify-center">
                    Numero de Documento
                  </h5>
                </div>
                <hr />
                {employees.map((employee) => {
                  return (
                    <div
                      key={employee.userId}
                      className="bg-white py-4 rounded-lg shadow-md mb-4 grid grid-cols-9 gap-3 w-full"
                    >
                      <p className="text-gray-600 flex items-center justify-center">
                        {employee.userId}
                      </p>
                      <h3 className="text-xl font-semibold flex items-center justify-center text-center">
                        {employee.userName}
                      </h3>
                      <p className="text-gray-600 flex items-center justify-center">
                        {employee.email}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {employee.fullName}
                      </p>

                      <p className="text-gray-600 flex items-center justify-center">
                        {employee.role}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {employee.phoneNumber}
                      </p>
                      <p className="text-gray-600 flex items-center justify-center">
                        {employee.documentNumber}
                      </p>
                      <button
                        onClick={() => {
                          openUpdateModal(employee);
                        }}
                        className="text-gray-600 flex items-center justify-center"
                      >
                        <BsPencilSquare className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-300" />
                      </button>
                      <button
                        onClick={() => {
                          openSetRoleModal(employee);
                        }}
                        className="text-gray-600 flex items-center justify-center"
                      >
                        <RiUserSettingsLine className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-300" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </article>

      {showCreate && (
        <>
          <RegisterEmp
            onClose={closeCreateModal}
            onSuccess={handleCreateSuccess}
          />
        </>
      )}
      {showUpdate && (
        <>
          <UpdateEmployee
            user={userEmployee}
            onClose={closeUpdateModal}
            onSuccess={handleUpdateSuccess}
          />
        </>
      )}
      {showSetRole && (
        <>
          <SetRoleComp
            employee={userEmployee}
            onClose={closeSetRoleModal}
            onSuccess={handleSetRoleSuccess}
          />
        </>
      )}
    </>
  );
};

export default EmployeeList;

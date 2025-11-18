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
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-end">
          <button
            onClick={openCreateModal}
            className="bg-pink-400 hover:bg-pink-600 transition-all ease-in-out text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Registrar Empleado
          </button>
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {loading && <Loading fullscreen={false} />}
          {!loading && employees.length === 0 && (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold text-gray-600">
                No hay empleados registrados
              </h2>
            </div>
          )}

          {!loading && employees.length > 0 && (
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
                      DUI
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Responsibility
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.userId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {employee.userId}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                        {employee.fullName}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {employee.phoneNumber}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        <a
                          href={`mailto:${employee.email}`}
                          className="text-blue-500 hover:underline"
                        >
                          {employee.email}
                        </a>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {employee.documentNumber}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">{employee.role}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openUpdateModal(employee)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <BsPencilSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openSetRoleModal(employee)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <RiUserSettingsLine className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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

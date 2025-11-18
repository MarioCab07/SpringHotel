import { useEffect, useState } from "react";
import { GetAllEmployees } from "../../service/api.services";
import { Loading } from "../Loading";
import { toast } from "react-toastify";
import RegisterEmp from "./RegisterEmp";
import EmployeeDetailPanel from "./EmployeeDetailPanel";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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

  const openDetailPanel = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailPanel(true);
  };
  const closeDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedEmployee(null);
  };
  const handleDetailSuccess = () => {
    setShowDetailPanel(false);
    setSelectedEmployee(null);
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

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-end">
          <button
            onClick={openCreateModal}
            className="px-5 py-2 bg-[#D9C696] hover:bg-[#c5b386] active:bg-[#b5a476] text-gray-900 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
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
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.userId}
                      onClick={() => openDetailPanel(employee)}
                      className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          {employee.email}
                        </a>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {employee.documentNumber}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">{employee.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <RegisterEmp
          isOpen={showCreate}
          onClose={closeCreateModal}
          onSuccess={handleCreateSuccess}
        />
      )}
      {showDetailPanel && (
        <EmployeeDetailPanel
          isOpen={showDetailPanel}
          employee={selectedEmployee}
          onClose={closeDetailPanel}
          onSuccess={handleDetailSuccess}
        />
      )}
    </>
  );
};

export default EmployeeList;

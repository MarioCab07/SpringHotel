import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { UpdateUser, SetRole, GetAllRoles } from "../../service/api.services";
import { toast } from "react-toastify";
import Select from "react-select";
import countryList from "react-select-country-list";

const EmployeeDetailPanel = ({ isOpen, employee, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [changeUser, setChangeUser] = useState({
    userId: employee?.userId || "",
    fullName: employee?.fullName || "",
    email: employee?.email || "",
    documentNumber: employee?.documentNumber || "",
    country: employee?.country || "",
    phoneNumber: employee?.phoneNumber || "",
    userName: employee?.userName || "",
  });
  const [formData, setFormData] = useState({
    userId: employee?.userId || "",
    roleName: employee?.role || "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setChangeUser({
        userId: employee.userId,
        fullName: employee.fullName,
        email: employee.email,
        documentNumber: employee.documentNumber,
        country: employee.country,
        phoneNumber: employee.phoneNumber,
        userName: employee.userName,
      });
      setFormData({
        userId: employee.userId,
        roleName: employee.role,
      });
    }
  }, [employee]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetAllRoles();
        if (response.status === 200) {
          const roleOptions = response.data.data.map((role) => role.roleName);
          setRoles(roleOptions);
        }
      } catch (error) {
        toast.error("Error al cargar los roles: " + error.message);
      }
    };
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (countryCode) => {
    setChangeUser((prev) => ({ ...prev, country: countryCode }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      roleName: role,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!changeUser.fullName.trim() || !changeUser.email.trim() || !changeUser.documentNumber.trim() || !changeUser.phoneNumber.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const response = await UpdateUser(changeUser);
      if (response.status === 200) {
        toast.success("Empleado actualizado exitosamente");
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al actualizar el empleado: " + (error.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Cambiando rol...");
    try {
      const response = await SetRole(formData);
      if (response.status === 200) {
        toast.dismiss();
        toast.success("Rol cambiado exitosamente");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error al cambiar el rol: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

  const countryOptions = countryList().getData();
  const selectedCountry = countryOptions.find((opt) => opt.value === changeUser.country);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f3f4f6",
      borderColor: state.isFocused ? "#f2789f" : "#d1d5db",
      borderRadius: "12px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(242, 120, 159, 0.25)" : "none",
      "&:hover": { borderColor: "#f2789f" },
      minHeight: "48px",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#ffffff", zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#fce7f3" : "#ffffff",
      color: "#000000",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000000",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Detalles de Empleado</h2>
          <div className="w-20" /> {/* Spacer para centrar el título */}
        </header>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Editar
          </button>
          <button
            onClick={() => setActiveTab("role")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "role"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Cambiar Rol
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "edit" && (
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={changeUser.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={changeUser.email}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                  placeholder="Ej: juan@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={changeUser.documentNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                  placeholder="Ej: 12345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País
                </label>
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(opt) => handleCountryChange(opt?.value ?? "")}
                  placeholder="Selecciona un país"
                  styles={customSelectStyles}
                  isClearable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Teléfono
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={changeUser.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                  placeholder="Ej: +1234567890"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "role" && (
            <form onSubmit={handleRoleSubmit} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Nombre:</span> {employee.fullName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Usuario:</span> {employee.userName}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles
                </label>
                <Select
                  options={roles.map((role) => ({ value: role, label: role }))}
                  value={roles.includes(formData.roleName) ? { value: formData.roleName, label: formData.roleName } : null}
                  onChange={(opt) => handleRoleChange(opt?.value || "")}
                  placeholder="Selecciona un rol"
                  styles={customSelectStyles}
                  isClearable={false}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
                >
                  {loading ? "Cambiando..." : "Confirmar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EmployeeDetailPanel;


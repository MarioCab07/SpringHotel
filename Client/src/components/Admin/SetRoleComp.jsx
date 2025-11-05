import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SetRole, GetAllRoles } from "../../service/api.services";
import Select from "../Select";

const SetRoleComp = ({ employee, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    userId: employee.userId,
    roleName: employee.role,
  });
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetAllRoles();
        if (response.status === 200) {
          const roleOptions = response.data.data.map((role) => {
            return role.roleName;
          });

          setRoles(roleOptions);
        }
      } catch (error) {
        toast.error("Error al cargar los roles: " + error.message);
      }
    };
    fetchRoles();
  }, []);

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      roleName: role,
    }));
  };

  const handleSubmit = async () => {
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
      toast.error("Error al cambiar el rol: " + error.message);
    }
  };

  return (
    <>
      <article className="w-full text-white max-w-2xl mx-auto p-6 bg-[#0C0950] rounded-lg shadow-md top-1/5 left-1/3 absolute z-50 overflow-visible flex flex-col gap-8">
        <h2 className="text-center w-full font-bold text-2xl">Cambiar Rol</h2>
        <div className="flex flex-col gap-4 ">
          <p>
            <span className="font-semibold">Nombre</span>: {employee.fullName}{" "}
            <br />
          </p>
          <p>
            <span className="font-semibold">Usuario</span>: {employee.userName}{" "}
            <br />
          </p>
        </div>
        <Select
          value={roles.includes(formData.roleName) ? formData.roleName : ""}
          label={"Roles"}
          setValue={handleRoleChange}
          options={roles}
          optionColor="black"
        />
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-gray-600 rounded-2xl py-2 px-4 cursor-pointer font-semibold hover:bg-gray-400 transition-all ease-in-out duration-300 text-white"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-pink-600 rounded-2xl py-2 px-4 cursor-pointer font-semibold hover:bg-pink-400 transition-all ease-in-out duration-300 text-white"
          >
            Confirmar
          </button>
        </div>
      </article>
    </>
  );
};

export default SetRoleComp;

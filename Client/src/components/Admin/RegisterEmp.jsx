import { useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";
import { RegisterEmployee } from "../../service/api.services";
import { toast } from "react-toastify";
import Select from "react-select";
import countryList from "react-select-country-list";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const RegisterEmp = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    documentNumber: "",
    country: "",
    phoneNumber: "",
  });

  const [birthDate, setBirthDate] = useState(dayjs());
  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (countryCode) => {
    setFormData((prev) => ({ ...prev, country: countryCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.documentNumber.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.country
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        birthDate: birthDate.format("YYYY-MM-DD"),
        country: formData.country || "SV",
      };
      
      const response = await RegisterEmployee(data);
      if (response.status === 201) {
        toast.success("Employee registered successfully");
        
        setCredentials({
          userName: response.data.data.userName,
          password: response.data.data.generatedPassword,
        });
        setShowCredentials(true);

        // Limpiar formulario
        setFormData({
          fullName: "",
          email: "",
          documentNumber: "",
          country: "",
          phoneNumber: "",
        });
        setBirthDate(dayjs());
      }
    } catch (error) {
      toast.error("Error registering employee: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowCredentials(false);
    setCredentials({ userName: "", password: "" });
    onClose();
  };

  const handleContinue = () => {
    setShowCredentials(false);
    setCredentials({ userName: "", password: "" });
    onSuccess();
  };

  if (!isOpen) return null;

  const countryOptions = countryList().getData();
  const selectedCountry = countryOptions.find((opt) => opt.value === formData.country);

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
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded transition">
            <FaChevronLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="font-serif text-lg text-gray-900">Register Employee</h2>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:hover:shadow-none disabled:hover:transform-none text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </header>

        {showCredentials ? (
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee registered successfully</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username:
                  </label>
                  <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {credentials.userName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password:
                  </label>
                  <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {credentials.password}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Save these credentials. The employee will need them to log in.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleContinue}
                  className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out"
                >
                  Continue
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                placeholder="Ex: John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                placeholder="Ex: john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Number
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                placeholder="Ex: 12345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 border border-gray-300 p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2789f] focus:border-transparent transition"
                placeholder="Ex: +1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Select
                options={countryOptions}
                value={selectedCountry}
                onChange={(opt) => handleCountryChange(opt?.value ?? "")}
                  placeholder="Select a country"
                styles={customSelectStyles}
                isClearable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={birthDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setBirthDate(newValue);
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: {
                        "& .MuiInputBase-root": {
                          backgroundColor: "#f3f4f6",
                          borderRadius: "12px",
                          border: "1px solid #d1d5db",
                        },
                        "& .MuiInputBase-input": {
                          color: "#000000",
                          padding: "12px",
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6b7280",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#f2789f",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f2789f",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f2789f",
                          borderWidth: "2px",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#6b7280",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default RegisterEmp;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UserRegister } from "../../service/api.services";
import CountrySelector from "../CountrySelector";
import DatePickerValue from "../DatePicker";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import { GoogleLogin } from "@react-oauth/google";
import { LoginWithGoogle } from "../../service/api.services";
import { CircularProgress, Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Box, Typography, FormControl, TextField, Grid } from "@mui/material";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login, loginGoogle, loading, setLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    documentNumber: "",
    country: "",
    userName: "",
    password: "",
    phoneNumber: "",
    birthDate: "",
  });

  const [birthDate, setBirthDate] = useState(dayjs());
  const [errors, setErrors] = useState([]);

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

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const token = credentialResponse.credential;

      const response = await LoginWithGoogle({ token });
      if (response.status === 200) {
        loginGoogle(response.data);
        toast.success("Sesión iniciada exitosamente");

        const role = response.data.role;

        if (role === "EMPLOYEE") {
          navigate("/employee");
        } else if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "CLEANING_STAFF") {
          navigate("/cleaning-staff");
        } else {
          navigate("/rooms");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      birthDate: birthDate.format("YYYY-MM-DD"),
      country: formData.country || "SV",
    };
    toast.info("Registrando usuario...");
    try {
      const response = await UserRegister(data);
      if (response.status === 200) {
        toast.success("Usuario registrado exitosamente");
        setFormData({
          fullName: "",
          email: "",
          documentNumber: "",
          country: "",
          userName: "",
          password: "",
          phoneNumber: "",
        });
        setBirthDate(dayjs());
        setErrors([]);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (Array.isArray(error.message)) {
        setErrors(error.message);
      } else {
        setErrors([error.message]);
      }
      toast.error("Error al registrar el usuario");
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleError = () => {
    toast.error("Error en el inicio de sesión con Google");
  };

  return (
    <>
      <Typography
        variant="h2"
        sx={{ fontFamily: "Times New Roman, Times, serif" }}
      >
        Sign Up{" "}
      </Typography>

      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"80%"}
        padding={2}
        gap={4}
      >
        <Box display={"flex"} justifyContent={"center"} gap={4}>
          <TextField
            fullWidth
            value={formData.fullName}
            label={"Full Name"}
            name="fullName"
            required
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
          <TextField
            value={formData.documentNumber}
            label={"Document"}
            name="documentNumber"
            required
            placeholder="ID, Passport..."
            onChange={handleChange}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
        </Box>
        <Box display={"flex"} justifyContent={"center"} gap={4}>
          <TextField
            value={formData.phoneNumber}
            label={"Phone Number"}
            name="phoneNumber"
            required
            fullWidth
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
          <TextField
            value={formData.email}
            label={"Email"}
            name="email"
            required
            fullWidth
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
        </Box>
        <Box display={"flex"} justifyContent={"center"} gap={4}>
          <TextField
            fullWidth
            value={formData.userName}
            label={"Username"}
            name="userName"
            required
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
          <TextField
            value={formData.password}
            label={"Password"}
            name="password"
            type="password"
            required
            fullWidth
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
        </Box>
        <Box display={"flex"} justifyContent={"center"} gap={4}>
          <CountrySelector
            value={formData.country}
            onChange={handleCountryChange}
          />

          <DatePickerValue
            date={birthDate}
            setDate={setBirthDate}
            label="Birth Date"
          />
        </Box>

        {/* Errores + Login + Botón + Google */}
        {errors.length > 0 && (
          <div className="text-red-400 text-sm">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Typography color="gray">
            Already have an account? Log In{" "}
            <Link
              to="/login"
              style={{ color: "#D9C696" }}
              className="hover:underline"
            >
              here
            </Link>
          </Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#D9C696" }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>

          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </Box>
      </Box>

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default RegisterForm;

{
  /* <Grid item xs={12} md={6}>
            <TextField
              value={formData.email}
              label={"Email"}
              name="email"
              required
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                  "&:hover fieldset": { borderWidth: 2 },
                  "&.Mui-focused fieldset": { borderWidth: 2 },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              value={formData.documentNumber}
              label={"Document"}
              name="documentNumber"
              required
              placeholder="ID, Passport..."
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                  "&:hover fieldset": { borderWidth: 2 },
                  "&.Mui-focused fieldset": { borderWidth: 2 },
                },
              }}
            />
          </Grid>

          
          <Grid item xs={12} md={6}>
            <TextField
              value={formData.phoneNumber}
              label={"Phone Number"}
              name="phoneNumber"
              required
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                  "&:hover fieldset": { borderWidth: 2 },
                  "&.Mui-focused fieldset": { borderWidth: 2 },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              value={formData.password}
              label={"Password"}
              name="password"
              type="password"
              required
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                  "&:hover fieldset": { borderWidth: 2 },
                  "&.Mui-focused fieldset": { borderWidth: 2 },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CountrySelector
              value={formData.country}
              onChange={handleCountryChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePickerValue
              date={birthDate}
              setDate={setBirthDate}
              label="Birth Date"
            />
          </Grid> 
          <TextField
            fullWidth
            value={formData.userName}
            label={"Username"}
            name="userName"
            required
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderWidth: 2, borderColor: "#D9C696" },
                "&:hover fieldset": { borderWidth: 2 },
                "&.Mui-focused fieldset": { borderWidth: 2 },
              },
            }}
          />
          
          */
}

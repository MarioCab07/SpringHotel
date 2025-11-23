import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { LoginWithGoogle } from "../../service/api.services";
import { Button, CircularProgress } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Box, Typography, FormControl, TextField } from "@mui/material";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loginGoogle, loading, setLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("Iniciando sesión...");
    try {
      const response = await login(formData);
      if (response.status === 200) {
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
        Log In{" "}
      </Typography>
      <FormControl
        sx={{ display: "flex", flexDirection: "column", width: "80%", gap: 6 }}
      >
        <TextField
          value={formData.username}
          label={"User"}
          name="username"
          required
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderWidth: 2, // borde más grueso
                borderColor: "#D9C696", // opcional: tu color
              },
              "&:hover fieldset": {
                borderWidth: 2,
              },
              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
            },
          }}
        />
        <TextField
          value={formData.password}
          label={"Password"}
          required
          name="password"
          type="password"
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderWidth: 2, // borde más grueso
                borderColor: "#D9C696", // opcional: tu color
              },
              "&:hover fieldset": {
                borderWidth: 2,
              },
              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
            },
          }}
        />

        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Typography color="gray">
            Don't have an account? Sign up{" "}
            <Link
              to="/register"
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
            Log In
          </Button>

          <GoogleLogin
            locale="en"
            onSuccess={handleSuccess}
            onError={handleError}
            text="signin_with"
          />
        </Box>
      </FormControl>

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default LoginForm;

import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputPassword = ({ label = "Password", value, onChange, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  return (
    <FormControl variant="outlined" fullWidth size="small">
      <InputLabel
        htmlFor={name || "password-field"}
        sx={{
          color: "white",
          "&.Mui-focused": {
            color: "white",
          },
        }}
      >
        {label}
      </InputLabel>

      <OutlinedInput
        id={name || "password-field"}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        name={name}
        label={label}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
              aria-label={showPassword ? "hide password" : "show password"}
              sx={{ color: "white" }} // icono blanco
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          backgroundColor: "transparent",
          borderRadius: "8px",
          height: "50px",
          color: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // borde blanco
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "& input": {
            color: "white", // texto blanco en el input
          },
        }}
      />
    </FormControl>
  );
};

export default InputPassword;

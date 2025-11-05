import React from "react";
import TextField from "@mui/material/TextField";

const StandardInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  ...props
}) => {
  return (
    <TextField
      variant="standard"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth
      sx={{
        input: {
          color: "white",
        },

        label: {
          color: "white",
          "&.Mui-focused": {
            color: "#dddddd",
          },
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: "white",
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "white",
        },
      }}
      {...props}
    />
  );
};

export default StandardInput;

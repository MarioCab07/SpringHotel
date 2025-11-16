import React, { useMemo } from "react";
import countryList from "react-select-country-list";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CountrySelector = ({
  value,
  onChange,
  placeholder = "Select a country",
}) => {
  const options = useMemo(() => countryList().getData(), []);

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel sx={{ color: "#B3B3B3" }}>{placeholder}</InputLabel>

      <Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        label={placeholder}
        sx={{
          // 🔹 Texto seleccionado negro
          "& .MuiSelect-select": {
            color: "#000000",
          },

          // 🔹 Placeholder gris
          "& .MuiInputLabel-root": {
            color: "#B3B3B3 !important",
          },

          // 🔹 Borde grueso personalizado
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "#D9C696",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
          height: "56px",
        }}
      >
        {options.map((country) => (
          <MenuItem key={country.value} value={country.value}>
            {country.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CountrySelector;

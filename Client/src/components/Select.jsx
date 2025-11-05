import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const BasicSelect = ({
  options,
  value,
  setValue,
  label,
  textColor = "white",
}) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="select-label" sx={{ color: textColor }}>
          {label}
        </InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={value}
          label={label}
          onChange={handleChange}
          sx={{
            color: textColor,
            "& .MuiSelect-icon": {
              color: textColor,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: textColor,
            },
          }}
        >
          {options.map((opt) => {
            return (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;

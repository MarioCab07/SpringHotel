import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerValue = ({ date, setDate, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        <DatePicker
          sx={{ width: "100%" }}
          label={label}
          value={date}
          onChange={(newValue) => {
            if (newValue) {
              setDate(newValue);
            }
          }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              sx: {
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                  "& fieldset": {
                    borderWidth: 2,
                    borderColor: "#D9C696",
                  },
                  "&:hover fieldset": {
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  },
                },

                // 🔹 Placeholder gris
                "& .MuiInputLabel-root": {
                  color: "#B3B3B3",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#B3B3B3",
                },

                // 🔹 Texto seleccionado negro
                "& .MuiInputBase-input": {
                  color: "#000000",
                },

                // Ícono del datepicker blanco (opcional)
                "& .MuiSvgIcon-root": {
                  color: "white",
                },

                borderRadius: "8px",
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DatePickerValue;

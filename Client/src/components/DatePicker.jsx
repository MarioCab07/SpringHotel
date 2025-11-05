import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerValue = ({ date, setDate, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <DatePicker
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
                "& .MuiInputBase-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
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

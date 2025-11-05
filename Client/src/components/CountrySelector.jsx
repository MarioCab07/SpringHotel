import React, { useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const CountrySelector = ({
  value,
  onChange,
  placeholder = "Select a country",
}) => {
  const options = useMemo(() => countryList().getData(), []);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value]
  );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#1976d2" : "#cccccc",
      borderRadius: "8px",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(25, 118, 210, 0.25)"
        : "none",
      "&:hover": { borderColor: "#1976d2" },
      minHeight: "40px",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#ffffff", zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#eeeeee" : "#ffffff",
      color: "#000000",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#ffffff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#ffffff",
    }),
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(opt) => onChange(opt?.value ?? null)}
      placeholder={placeholder}
      styles={customStyles}
      isClearable
    />
  );
};

export default CountrySelector;

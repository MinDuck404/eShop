import React, { useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const SearchableSelect = ({
  options,
  label,
  placeholder,
  selectCat,
  selectedValue,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Handle search term change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  // Handle option selection
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <Select
        value={selectedValue !== undefined ? selectedValue : selectedOption}
        onChange={handleSelectChange}
        displayEmpty
        renderValue={() => (selectedOption ? selectedOption : selectedValue)}
      >
        {/* Search Input */}
        <MenuItem disabled>
          <TextField
            autoFocus
            placeholder="Type to search..."
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </MenuItem>

      

        {/* Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <MenuItem
              key={index}
              value={option.name}
              onClick={() => selectCat(option.name, option._id)}
            >
              {option.name}
              <span className="badge badge-primary ml-auto">
                {option.parentId !== null && `${option.parentCatName} /`}{" "}
                {option.name}
              </span>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options found</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default SearchableSelect;

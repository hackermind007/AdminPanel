import React from "react";
import { TextField as MuiTextField } from "@mui/material";
const TextField = ({
  variant = "outlined",
  type = "text",
  name ,
  label,
  value = "",
  onChange = () => {},
}) => {
  return (
    <div>
      <MuiTextField
        variant={variant}
        name={name}
        type={type}
        label={label}
        value={value}
        onChange={onChange}
        sx={{
          width: "100%",
          margin: "10px 0px",
        }}
      />
    </div>
  );
};

export default TextField;

import React from "react";

export const Label = ({ children, className = "", ...props }) => {
  return (
    <label
      className={`text-sm font-medium text-white ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

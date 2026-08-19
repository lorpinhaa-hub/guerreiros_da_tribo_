import React from "react";

export const Image = ({ src, alt = "", className = "", ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

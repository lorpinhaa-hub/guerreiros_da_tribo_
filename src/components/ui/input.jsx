import React from "react";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-lg px-3 py-2 text-sm bg-transparent border border-[#2E8B57] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#9CE5B5] ${className}`}
      {...props}
    />
  );
};

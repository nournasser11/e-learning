"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean; // Added disabled property
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`p-2 rounded font-bold ${disabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

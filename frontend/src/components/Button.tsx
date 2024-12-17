"use client";

import React from 'react';


interface ButtonProps {

  type: "button" | "submit" | "reset";

  className?: string;

  onClick?: () => void;

  disabled?: boolean;

  children?: React.ReactNode;

}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
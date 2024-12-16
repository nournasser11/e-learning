"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void; // Optional onClick for flexibility
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean; // Add type prop
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

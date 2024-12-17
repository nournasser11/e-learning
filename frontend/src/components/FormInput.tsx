import React, { ChangeEvent } from "react";

interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string; // Allow custom classes
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = "", // Default to an empty string
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`block w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default FormInput;

// FormInput.tsx
import React from "react";

export interface FormInputProps {
  type: string;
  name: string; // Add the name property
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <input
      type={type}
      name={name} // Pass the name prop to the input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary"
    />
  );
};

export default FormInput;

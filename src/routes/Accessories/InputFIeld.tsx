import React from 'react';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  className = "" 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-600 text-sm mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${className}`}
      />
    </div>
  );
};
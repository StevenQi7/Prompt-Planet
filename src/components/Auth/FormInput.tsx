import React from 'react';
import { IconType } from 'react-icons';

interface FormInputProps {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  type,
  placeholder,
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  rightIcon,
  onRightIconClick
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full pl-10 ${rightIcon ? 'pr-10' : 'pr-3'} py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-700`}
          placeholder={placeholder}
        />
        {rightIcon && (
          <button 
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput; 
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface FormMessageProps {
  successMessage?: string;
  errorMessage?: string;
}

const FormMessage: React.FC<FormMessageProps> = ({
  successMessage,
  errorMessage
}) => {
  if (!successMessage && !errorMessage) return null;
  
  if (successMessage) {
    return (
      <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center">
        <FaCheck className="mr-2 flex-shrink-0" />
        <span>{successMessage}</span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center">
        <FaTimes className="mr-2 flex-shrink-0" />
        <span>{errorMessage}</span>
      </div>
    );
  }
  
  return null;
};

export default FormMessage; 
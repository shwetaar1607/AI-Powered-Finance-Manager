import React from 'react';

const Input = ({ label, id, type = 'text', value, onChange, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-800 text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        {...props}
      />
    </div>
  );
};

export default Input;
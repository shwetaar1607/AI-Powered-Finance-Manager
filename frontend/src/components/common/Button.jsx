import React from 'react';

const Button = ({ children, variant = 'primary', disabled, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded font-semibold text-white transition-colors';
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    disabled: 'bg-gray-400 cursor-not-allowed',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[disabled ? 'disabled' : variant]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
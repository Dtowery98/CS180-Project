import React from "react";

type ButtonProps = {
  text: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const Button = ({ text, onClick, className = "", type = "button", disabled = false} : ButtonProps) => {
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={className}
      disabled={disabled}
      style={{cursor : disabled ? 'not-allowed' : 'pointer' }}>
      {text}
    </button>
  );
};

export default Button;
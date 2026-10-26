import React from "react";

type ButtonProps = {
  text: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button = ({ text, onClick, className = "" } : ButtonProps) => {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className={className}
      style={{ cursor: 'pointer' }}>
      {text}
    </button>
  );
};

export default Button;
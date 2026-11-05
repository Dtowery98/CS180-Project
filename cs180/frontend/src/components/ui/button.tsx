import React from "react";
import Link from "next/link";

type ButtonProps = {
  text: React.ReactNode;
  href?: string;                                        // where it links to
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // optional now
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const Button = ({ text, href, onClick, className = "", type = "button", disabled = false }: ButtonProps) => {
  // If an href is given, act as a link
  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center justify-center cursor-pointer ${className}`}>
        {text}
      </Link>
    );
  }

  // Otherwise, act like your original button
  return (
    <button type={type} onClick={onClick} className={`cursor-pointer ${className}`}>
      {text}
    </button>
  );
};

export default Button;
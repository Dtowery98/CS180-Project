import { useState, type ChangeEvent } from 'react';

type SingleLineTextBoxProps = {
    placeholder: string
    className?: string
    name?: string
    type?: "text" | "email" | "password"
}

const SingleLineTextBox = ({ placeholder, className = "", name, type = "text" } : SingleLineTextBoxProps) => {
  // 1. Create a state variable to hold the text box value
  const [textValue, setTextValue] = useState('');

  // 2. Update the state whenever the user types
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  return (
    <div className="p-4">
      <input style={{ paddingLeft: '20px'}}
        id={name}
        name = {name}
        type={type}
        className={className}
        value={textValue}       // Binds the text box to our state
        onChange={handleChange} // Triggers when text changes
        placeholder={placeholder}
      />
    </div>
  );
}

export default SingleLineTextBox;

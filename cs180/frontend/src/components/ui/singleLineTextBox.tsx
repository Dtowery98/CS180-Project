import { useState, type ChangeEvent } from 'react';

type SingleLineTextBoxProps = {
    placeholder: string
    className?: string
}

const SingleLineTextBox = ({ placeholder, className = "" } : SingleLineTextBoxProps) => {
  // 1. Create a state variable to hold the text box value
  const [textValue, setTextValue] = useState('');

  // 2. Update the state whenever the user types
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  return (
    <div>
      <label htmlFor="username">Enter Name: </label>
      
      <input style={{ paddingLeft: '20px'}}
        id="username"
        type="text"
        className={className}
        value={textValue}       // Binds the text box to our state
        onChange={handleChange} // Triggers when text changes
        placeholder={placeholder}
      />

      <p>You typed: {textValue}</p>
    </div>
  );
}

export default SingleLineTextBox;

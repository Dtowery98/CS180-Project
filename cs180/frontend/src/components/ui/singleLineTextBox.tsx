type SingleLineTextBoxProps = {
    placeholder: string;
    className?: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
};

const SingleLineTextBox = ({
    placeholder,
    className = "",
    type = "text",
    value,
    onChange
}: SingleLineTextBoxProps) => {

    return (
        <div className="p-4">
            <input
                style={{ paddingLeft: '20px' }}
                type={type}
                className={className}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
};

export default SingleLineTextBox;
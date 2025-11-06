import { useId } from "react";

interface FormProps {
	action: string;
	method: string;
	children: React.ReactNode;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = ({ action, method, children, onSubmit }: FormProps) => {
	return (
		<form action={action} method={method} onSubmit={onSubmit}>
			{children}
		</form>
	);
};

interface FormGroupProps {
	children: React.ReactNode;
}

Form.Group = ({ children }: FormGroupProps) => {
	return <div className="form-group">{children}</div>;
};

interface FormLabelProps {
	children: React.ReactNode;
}

Form.Label = ({ children }: FormLabelProps) => {
	return <label htmlFor="email">{children}</label>;
};

interface FormInputProps {
	type: string;
	name: string;
	placeholder: string;
	required: boolean;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

Form.Input = ({
	type,
	name,
	placeholder,
	required,
	value,
	onChange,
	onBlur,
}: FormInputProps) => {
	const id = useId();

	return (
		<input
			type={type}
			name={name}
			id={id}
			spellCheck={false}
			required={required}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
		/>
	);
};

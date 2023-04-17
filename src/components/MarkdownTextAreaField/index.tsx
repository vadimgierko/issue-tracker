import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import MarkdownRenderer from "../MarkdownRenderer";
import useTheme from "../../context/useTheme";

type MarkdownTextAreaFieldProps = {
	label: string;
	value: string;
	placeholder?: string;
	formGroupClassName?: string;
	formControlClassName?: string;
	formCheckboxClassName?: string;
	onChange: (value: string) => void;
};

export default function MarkdownTextAreaField({
	label,
	value,
	placeholder,
	formGroupClassName = "",
	formControlClassName = "",
	formCheckboxClassName = "",
	onChange,
}: MarkdownTextAreaFieldProps) {
	const { theme } = useTheme();
	const [showMarkdown, setShowMarkdown] = useState(false);

	return (
		<Form.Group className={formGroupClassName}>
			{showMarkdown ? (
				<MarkdownRenderer markdown={value} />
			) : (
				<FloatingLabel label={label}>
					<Form.Control
						as="textarea"
						className={formControlClassName}
						value={value}
						placeholder={placeholder}
						style={{
							height: "100px",
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) => onChange(e.target.value)}
					/>
				</FloatingLabel>
			)}

			<Form.Check
				className={formCheckboxClassName}
				type="checkbox"
				label="show markdown"
				checked={showMarkdown}
				onChange={() => setShowMarkdown(!showMarkdown)}
			/>
		</Form.Group>
	);
}

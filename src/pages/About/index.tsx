import { Spinner } from "react-bootstrap";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import useMarkdownFromFile from "../../hooks/useMarkdownFromFile";

export default function About() {
	const { value: markdown, loading } = useMarkdownFromFile(
		"content/pages/About.md"
	);

	if (loading)
		return (
			<div className="about">
				<div className="text-center">
					<Spinner />
				</div>
			</div>
		);

	return (
		<div className="about">
			<MarkdownRenderer markdown={markdown} />
		</div>
	);
}

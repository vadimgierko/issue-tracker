import { Spinner } from "react-bootstrap";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import useMarkdownFromFile from "../../hooks/useMarkdownFromFile";
import PageHeader from "../../components/Layout/PageHeader";

export default function About() {
	const { value: markdown, loading } = useMarkdownFromFile(
		"content/pages/About.md"
	);

	return (
		<>
			<PageHeader pageTitle="About the Issue Tracker App" />
			<div className="about">
				{loading ? (
					<div className="text-center">
						<Spinner />
					</div>
				) : (
					<MarkdownRenderer markdown={markdown} />
				)}
			</div>
		</>
	);
}

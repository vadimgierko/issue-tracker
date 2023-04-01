import { Container } from "react-bootstrap";
import { AiOutlineGithub } from "react-icons/ai";
import { BsGlobe } from "react-icons/bs";
import MarkdownRenderer from "../MarkdownRenderer";
import useMaxWidth from "../../context/useMaxWidth";

interface FooterProps {
	authorFullName: string;
	creationYear?: number;
	githubProfileLink?: string;
	personalWebPageLink?: string;
	repoLink?: string;
}

export default function Footer({
	authorFullName,
	creationYear,
	githubProfileLink,
	personalWebPageLink,
	repoLink,
}: FooterProps) {
	const maxWidth = useMaxWidth();
	const currentYear = new Date().getFullYear();

	return (
		<Container
			as="footer"
			className="text-center"
			style={{
				color: "grey",
				maxWidth: maxWidth,
			}}
		>
			<p className="">
				&copy;{" "}
				{creationYear
					? creationYear === currentYear
						? creationYear.toString()
						: creationYear.toString() + currentYear.toString()
					: currentYear.toString()}{" "}
				{authorFullName}
				{personalWebPageLink && (
					<>
						{" "}
						<a
							className="footer-icon-link mx-1"
							href={personalWebPageLink}
							target="_blank"
							rel="noreferrer"
						>
							<BsGlobe className="mb-1" />
						</a>{" "}
						|{" "}
					</>
				)}
				{githubProfileLink && (
					<>
						<a
							className="footer-icon-link ms-1"
							href={githubProfileLink}
							target="_blank"
							rel="noreferrer"
						>
							<AiOutlineGithub className="mb-1" />
						</a>{" "}
						|{" "}
					</>
				)}
				{repoLink && (
					<a
						className="footer-icon-link ms-1"
						href={repoLink}
						target="_blank"
						rel="noreferrer"
						style={{ textDecoration: "none" }}
					>
						[app's code]
					</a>
				)}
			</p>
			<License />
		</Container>
	);
}

function License() {
	const licenseContent = `[![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)`;

	return <MarkdownRenderer markdown={licenseContent} />;
}

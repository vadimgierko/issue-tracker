import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
// functions that add iconProps to icons & return lists with card data:
import generateTechnologies from "./lib/generateTechnologies";
import generateFeatures from "./lib/generateFeatures";
// react-bootstrap components:
import Button from "react-bootstrap/Button";
import { Icon } from "./interfaces/Icon";
import { Section as ISection } from "./interfaces/Section";

export default function About() {
	const [windowSize, setWindowSize] = useState(window.innerWidth);
	const navigate = useNavigate();
	const [iconProps, setIconProps] = useState<Icon.Props | null>(null);
	const [sections, setSections] = useState<ISection.Section[]>([]);

	useEffect(() => {
		window.addEventListener("resize", () => {
			const size = window.innerWidth;
			setWindowSize(size);
		});
	}, []);

	useEffect(() => {
		// define icons props:
		const size = windowSize > 576 ? 80 : 50;
		const style = { margin: "0.5em" };
		const props = { style, size };
		setIconProps(props);
	}, [windowSize]);

	useEffect(() => {
		if (iconProps) {
			const TECHNOLOGIES = generateTechnologies(iconProps);
			const FEATURES = generateFeatures(iconProps);
			setSections([
				{
					header: "What you can do with linky_notes",
					cardsList: FEATURES,
					cardStyle: {
						padding: "0.5em",
						width: windowSize > 576 ? "33%" : "50%",
					},
				},
				{
					header: "Technologies used to build the app",
					cardsList: TECHNOLOGIES,
					cardStyle: {
						marginLeft: "1em",
						marginRight: "1em",
					},
				},
			]);
		}
	}, [iconProps]);

	return (
		<div className="text-center">
			<header>
				<h1 className="my-3" style={{ fontSize: windowSize > 576 ? 50 : 40 }}>
					Welcome to Issue Tracker!
				</h1>
				<p className="mb-5" style={{ fontSize: windowSize > 576 ? 20 : 16 }}>
					Track, manage, filter, sort, rank, nest and mix ordered & unordered
					issues in your dev projects & have an overview of all issues
					regardless of the project in 1 table.
				</p>
				<Button
					className="mb-5 me-3"
					variant="outline-success"
					size={windowSize > 576 ? "lg" : undefined}
					onClick={() => navigate("/signin")}
				>
					Sign In
				</Button>
				<Button
					className="mb-5"
					variant="outline-primary"
					size={windowSize > 576 ? "lg" : undefined}
					onClick={() => navigate("/signup")}
				>
					Sign Up
				</Button>
			</header>
			{sections.length
				? sections.map((section, i) => (
						<Section
							key={"section-" + i}
							header={section.header}
							cardsList={section.cardsList}
							cardStyle={section.cardStyle}
						/>
				  ))
				: null}
		</div>
	);
}

//===================================================================//

// import { Spinner } from "react-bootstrap";
// import MarkdownRenderer from "../../components/MarkdownRenderer";
// import useMarkdownFromFile from "../../hooks/useMarkdownFromFile";
// import PageHeader from "../../components/Layout/PageHeader";

// export default function About() {
// 	const { value: markdown, loading } = useMarkdownFromFile(
// 		"content/pages/About.md"
// 	);

// 	return (
// 		<>
// 			<PageHeader pageTitle="About the Issue Tracker App" />
// 			<div className="about">
// 				{loading ? (
// 					<div className="text-center">
// 						<Spinner />
// 					</div>
// 				) : (
// 					<MarkdownRenderer markdown={markdown} />
// 				)}
// 			</div>
// 		</>
// 	);
// }

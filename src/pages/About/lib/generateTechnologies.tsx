// import icons:
import {
	SiReact,
	SiFirebase,
	SiBootstrap,
	SiReactrouter,
	SiMarkdown,
	SiTypescript,
} from "react-icons/si";
import { Icon } from "../interfaces/Icon";
import { Card } from "../interfaces/Card";

export default function generateTechnologies(
	iconProps: Icon.Props
): Card.Card[] {
	return [
		{
			icon: <SiReact {...iconProps} />,
			header: "React",
		},
		{
			icon: <SiTypescript {...iconProps} />,
			header: "TypeScript",
		},
		{
			icon: <SiFirebase {...iconProps} />,
			header: "Firebase",
		},
		{
			icon: <SiReactrouter {...iconProps} />,
			header: "React Router",
		},
		{
			icon: <SiBootstrap {...iconProps} />,
			header: "Bootstrap",
		},
		{
			icon: <SiMarkdown {...iconProps} />,
			header: "Markdown",
		},
	];
}

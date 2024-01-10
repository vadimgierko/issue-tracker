// import icons:
import { MdDarkMode, MdFormatSize } from "react-icons/md";
import {
	AiOutlineLock,
	AiOutlineCloudDownload,
	AiOutlineFilter,
	AiOutlineFolder,
	AiOutlineCheckSquare,
	AiOutlineUnorderedList,
	AiOutlineTable,
} from "react-icons/ai";
import { TbArrowsSort } from "react-icons/tb";
import { Icon } from "../interfaces/Icon";
import { Card } from "../interfaces/Card";

export default function generateFeatures(iconProps: Icon.Props): Card.Card[] {
	return [
		{
			icon: <AiOutlineCheckSquare {...iconProps} />,
			header: "Issues",
			paragraph:
				"Add, update, delete issues and organize them in projects. Optionally you can add type, urgency, importance, estimated time & difficulty props to each issue.",
		},
		{
			icon: <AiOutlineFilter {...iconProps} />,
			header: "Filter",
			paragraph:
				"You can filter issues by type, urgency, importance, estimated time, difficulty & status.",
		},
		{
			icon: <TbArrowsSort {...iconProps} />,
			header: "Sort",
			paragraph:
				"You can sort issues by creation & update time, urgency, importance, estimated time, difficulty & rank (issues rank is calculated automatically)",
		},
		{
			icon: <AiOutlineFolder {...iconProps} />,
			header: "Projects",
			paragraph: "Add, update & delete projects containing your issues.",
		},
		{
			icon: <AiOutlineUnorderedList {...iconProps} />,
			header: "List mode: ordered, unordered, nested & mixed issues",
			paragraph:
				"You can add, convert & mix ordered & unordered issues, nest issues within issues and view project's issues in list mode.",
		},
		{
			icon: <AiOutlineTable {...iconProps} />,
			header: "Table mode with filter/sort",
			paragraph:
				"You can view your project's issues or all issues regardless of a project they belong to in 1 table & sort/filter them.",
		},
		//=========================================================================================================//
		{
			icon: <MdFormatSize {...iconProps} />,
			header: "Format",
			paragraph:
				"Format your issues & projects descriptions using Markdown syntax, HTML with inline styles, embeds, internal/ external links & highlighted code via built-in markdown editor etc.",
		},
		{
			icon: <AiOutlineCloudDownload {...iconProps} />,
			header: "Access, install & sync on all devices",
			paragraph:
				"This app works in a browser & is installable (PWA), so all you need is a device (mobile, tablet or laptop) with the Internet connection.",
		},
		{
			icon: <MdDarkMode {...iconProps} />,
			header: "Darkmode",
			paragraph: "You can use the app in light & dark mode.",
		},
		{
			icon: <AiOutlineLock {...iconProps} />,
			header: "Privacy",
			paragraph:
				"All your issues, projects & user data is private. If you won't share your password with anyone, your data is secure.",
		},
	];
}

import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import useTheme from "../../../context/useTheme";
import { IssueTableTabStatus } from "../../../interfaces/Issue";
import { BsThreeDots, BsExclamationSquare } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";

const tableTabs: IssueTableTabStatus[] = [
	"open",
	"in progress",
	"closed",
	//"all",
];

type IssuesTableTabsProps = {
	onTabSelect: (selectedTab: IssueTableTabStatus) => void;
};

export default function IssuesTableTabs({ onTabSelect }: IssuesTableTabsProps) {
	const { theme } = useTheme();
	const [activeTab, setActiveTab] = useState<IssueTableTabStatus>("open");

	return (
		<Tabs
			activeKey={activeTab}
			onSelect={(k: any) => {
				setActiveTab(k);
				onTabSelect(k);
			}}
			className="justify-content-center"
			//fill
			// style={{
			// 	backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
			// 	color: theme === "light" ? "black" : "white",
			// }}
		>
			{tableTabs.map((status) => (
				<Tab
					eventKey={status}
					title={
						<>
							{status === "closed" ? (
								<AiOutlineCheck className="text-secondary" />
							) : status === "in progress" ? (
								<BsThreeDots className="text-warning" />
							) : (
								<BsExclamationSquare className="text-danger" />
							)}{" "}
							{status}
						</>
					}
					key={status}
				/>
			))}
		</Tabs>
	);
}

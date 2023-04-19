import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import useTheme from "../../../context/useTheme";

type TableTab = "open" | "in progress" | "closed";
const tableTabs: TableTab[] = ["open", "in progress", "closed"];

type IssuesTableTabsProps = {
	onTabSelect: (selectedTab: TableTab) => void;
};

export default function IssuesTableTabs({ onTabSelect }: IssuesTableTabsProps) {
	const { theme } = useTheme();
	const [activeTab, setActiveTab] = useState<TableTab>("open");

	return (
		<Tabs
			activeKey={activeTab}
			onSelect={(k: any) => {
				setActiveTab(k);
				onTabSelect(k);
			}}
			className="justify-content-center"
			//fill
			style={{
				backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
				color: theme === "light" ? "black" : "white",
			}}
		>
			{tableTabs.map((t) => (
				<Tab eventKey={t} title={t} key={t} />
			))}
		</Tabs>
	);
}

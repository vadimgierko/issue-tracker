import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Issue } from "../../../interfaces/Issue";
import { BsThreeDots, BsExclamationSquare } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";

const tableTabs: Issue.TableTabStatus[] = [
	"open",
	"in progress",
	"closed",
	//"all",
];

type IssuesTableTabsProps = {
	onTabSelect: React.Dispatch<React.SetStateAction<Issue.TableTabStatus>>;
	filteredIssuesNumber: number;
};

export default function IssuesTableTabs({
	onTabSelect,
	filteredIssuesNumber,
}: IssuesTableTabsProps) {
	const [activeTab, setActiveTab] = useState<Issue.TableTabStatus>("open");

	return (
		<Tabs
			activeKey={activeTab}
			onSelect={(k: any) => {
				setActiveTab(k);
				onTabSelect(k);
			}}
			className="justify-content-center"
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
							{status === activeTab
								? status + ` (${filteredIssuesNumber})`
								: status}
						</>
					}
					key={status}
				/>
			))}
		</Tabs>
	);
}

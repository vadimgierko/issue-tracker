import useIssues from "../../context/useIssues";
import { Link } from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import IssuesFilterableTable from "./IssuesFilterableTable";
import { AiOutlinePlusSquare } from "react-icons/ai";
import createAddIssueLinkWithParams from "../../lib/createAddIssueLinkWithParams";

export default function Issues() {
	const { issues } = useIssues();

	function NoIssues() {
		return <p className="text-center">There are no issues... Add one!</p>;
	}

	return (
		<>
			<PageHeader
				pageTitle={
					<span>
						Issues ({issues.length}){" "}
						<Link
							to={createAddIssueLinkWithParams(null, false, null, null, null)}
						>
							<AiOutlinePlusSquare />
						</Link>
					</span>
				}
			></PageHeader>

			{issues && issues.length ? (
				<IssuesFilterableTable issues={issues} />
			) : (
				<NoIssues />
			)}
		</>
	);
}
